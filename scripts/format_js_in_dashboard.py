#!/usr/bin/env python3
import argparse
import subprocess


def run_prettier(code, indent):
    code = code.replace("\n" + indent, "\n")
    p = subprocess.run(
        [
            "npx",
            "prettier",
            "--stdin-filepath",
            "script.js",
            "--tab-width",
            "2",
        ],
        input=code.encode(),
        capture_output=True,
        check=True,
        cwd="frontend",
    )
    formatted = p.stdout.decode().rstrip()
    intended = indent + formatted.replace("\n", "\n" + indent)
    # strip lines with only whitespace
    return intended.replace(indent + "\n", "\n") + "\n"


def format_js_in_dashboard(f):
    # cannot use YAML parser here, because it won't preserve comments, additional newlines etc.
    formatted = ""

    for line in f:
        formatted += line
        if line == "    script: |\n" or line.startswith("    script: &"):
            current_script = ""
            for line in f:
                if line == "\n" or line.startswith("      "):
                    current_script += line
                else:
                    formatted += run_prettier(current_script, "      ") + "\n" + line
                    break
        elif line == "  inline: |\n":
            current_script = ""
            for line in f:
                if line == "\n" or line.startswith("    "):
                    current_script += line
                else:
                    formatted += run_prettier(current_script, "    ") + "\n" + line
                    break
            if current_script:
                formatted += run_prettier(current_script, "    ")

    return formatted


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("dashboard")
    args = parser.parse_args()

    with open(args.dashboard, encoding="utf-8") as f:
        formatted = format_js_in_dashboard(f)
    with open(args.dashboard, "w", encoding="utf-8") as f:
        f.write(formatted)


if __name__ == "__main__":
    main()
