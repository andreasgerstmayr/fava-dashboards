#!/usr/bin/env python3
import argparse
import subprocess


def run_prettier(code, indent):
    p = subprocess.run(
        ["prettier", "--stdin-filepath", "script.js", "--tab-width", "2"],
        input=code.encode(),
        capture_output=True,
    )
    formatted = p.stdout.decode()
    return (
        indent
        + formatted.rstrip().replace("\n", "\n" + indent).replace(indent + "\n", "\n")
        + "\n\n"
    )


def format_js_in_dashboard(f):
    # cannot use YAML parser here, because it won't preserve comments, additional newlines etc.
    formatted = ""
    script_started = False
    current_script = ""
    for line in f:
        if script_started:
            if line == "\n" or line.startswith("      "):
                current_script += line
            else:
                formatted += run_prettier(current_script, "      ")
                formatted += line
                script_started = False
                current_script = ""
        else:
            if line == "    script: |\n":
                script_started = True
            formatted += line

    if script_started:
        formatted += run_prettier(current_script, "      ")
    return formatted.rstrip() + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("dashboard")
    args = parser.parse_args()

    with open(args.dashboard) as f:
        formatted = format_js_in_dashboard(f)
    with open(args.dashboard, "w") as f:
        f.write(formatted)


if __name__ == "__main__":
    main()
