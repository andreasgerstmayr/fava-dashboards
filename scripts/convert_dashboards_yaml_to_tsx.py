#!/usr/bin/env python3

import argparse
import json
import re
import subprocess
from pathlib import Path

import yaml


def read_dashboards_utils(config_path: Path, config: dict):
    utils = config.get("utils", {})
    if "inline" in utils:
        return utils["inline"]
    elif "path" in utils:
        path = config_path.parent.joinpath(utils["path"])
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return ""


def convert(in_path: Path, out_path: Path):
    with open(in_path, "r", encoding="utf8") as f:
        config = yaml.safe_load(f)

    if not config:
        config = {}

    utils = read_dashboards_utils(in_path, config).strip()
    if utils:
        utils = "const utils = (function(){" + utils + "})();"
        del config["utils"]

    print("Converting...")
    for dashboard in config.get("dashboards", []):
        for i, panel in enumerate(dashboard.get("panels", [])):
            if "type" in panel:
                panel_type = panel["type"]
                if panel_type not in ["html", "echarts", "d3_sankey"]:
                    title = panel.get("title", "?")
                    print(f'WARN: Skipping panel "{title}" with unsupported type "{panel_type}"')
                    del dashboard["panels"][i]
                    continue

                panel["kind"] = panel_type
                del panel["type"]

            if "script" in panel:
                script = panel["script"]
                if "queries" in panel:
                    queries = json.dumps(panel["queries"])
                    queries = queries.replace("{{ledger.ccy}}", '"+ledger.ccy+"')

                    script = (
                        "const panelQueries = await Promise.all("
                        + queries
                        + ".map(async (query) => ({...query, result: await ledger.query(query.bql)})));\n"
                        + script.replace("panel.queries", "panelQueries")
                    )
                    del panel["queries"]

                panel["spec"] = "async ({ ledger, variables }) => {\n" + script + "}"
                del panel["script"]

    # indent=2 required for multiline-regexp below
    config_json = json.dumps(config, indent=2, ensure_ascii=False)

    # convert spec to a function
    def add_fn(m):
        init = m.group(1)
        value = json.loads(m.group(2))
        return init + value

    config_tsx = re.sub(r'( *"spec": )(.+)$', add_fn, config_json, flags=re.MULTILINE)
    config_tsx = f"""/// <reference types="./fava-dashboards.d.ts" />
import {{ defineConfig }} from "fava-dashboards";

{utils}

export default defineConfig({config_tsx});
"""

    with open(out_path, "w", encoding="utf8") as f:
        f.write(config_tsx)

    print("Formatting...")
    subprocess.run(
        ["npx", "prettier", "-w", out_path.absolute()],
        cwd=Path(__file__).parent.parent.joinpath("frontend"),
        check=True,
        stdout=subprocess.DEVNULL,
    )

    print(f"File saved to {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="dashboards.tsx", help="path to dashboards.tsx", type=Path)
    parser.add_argument("input", default="dashboards.yaml", help="path to dashboards.yaml", type=Path)
    args = parser.parse_args()

    convert(args.input, args.output)
