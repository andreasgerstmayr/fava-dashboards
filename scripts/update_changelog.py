#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import urllib.request
from datetime import datetime
from pathlib import Path

CHANGELOG_PATH = Path("CHANGELOG.md")
REPOSITORY = "andreasgerstmayr/fava-dashboards"


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True).strip()


def last_tag() -> str:
    return run(["git", "describe", "--tags", "--abbrev=0"])


def prs_since(tag: str):
    output = run(["git", "log", f"{tag}..HEAD", "--pretty=format:%s"])
    for commit in output.splitlines():
        print(commit)
    return []


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("version")
    args = parser.parse_args()

    tag = run(["git", "describe", "--tags", "--abbrev=0"])
    commits = run(["git", "log", f"{tag}..HEAD", "--pretty=format:%s"]).splitlines()
    date = datetime.today().strftime("%Y-%m-%d")

    entries = []
    for commit in reversed(commits):
        m = re.search(r"\(#(\d+)\)$", commit)
        if not m:
            continue

        pr_id = m.group(1)
        print(f"Fetching PR #{pr_id} info...")
        with urllib.request.urlopen(f"https://api.github.com/repos/{REPOSITORY}/pulls/{pr_id}") as url:
            data = json.loads(url.read().decode())
            pr_title = data["title"]
            pr_author = data["user"]["login"]

        if pr_author in ["dependabot[bot]"]:
            continue

        entries.append(
            f"* {pr_title} [#{pr_id}](https://github.com/{REPOSITORY}/pull/{pr_id}) ([@{pr_author}](https://github.com/{pr_author}))"
        )

    entries.insert(0, f"## {args.version} ({date})")
    entries.append("")

    lines = CHANGELOG_PATH.read_text(encoding="utf8").splitlines()
    lines[2:2] = entries
    CHANGELOG_PATH.write_text("\n".join(lines) + "\n", encoding="utf8")

    print("Wrote changelog to", CHANGELOG_PATH)


if __name__ == "__main__":
    main()
