# Fava Dashboards
[![Continuous Integration](https://github.com/andreasgerstmayr/fava-dashboards/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/andreasgerstmayr/fava-dashboards/actions/workflows/continuous-integration.yml)
[![PyPI](https://img.shields.io/pypi/v/fava-dashboards)](https://pypi.org/project/fava-dashboards/)

fava-dashboards allows creating custom dashboards in [Fava](https://github.com/beancount/fava).

Example dashboards with random data:
<a href="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Overview-1-chromium-linux.png">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Dark-Theme-Overview-1-chromium-linux.png">
    <img alt="Overview" src="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Overview-1-chromium-linux.png">
  </picture>
</a>
<a href="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Assets-1-chromium-linux.png">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Dark-Theme-Assets-1-chromium-linux.png">
    <img alt="Assets" src="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Assets-1-chromium-linux.png">
  </picture>
</a>
<a href="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Income-and-Expenses-1-chromium-linux.png">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Dark-Theme-Income-and-Expenses-1-chromium-linux.png">
    <img alt="Income and Expenses" src="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Income-and-Expenses-1-chromium-linux.png">
  </picture>
</a>
<a href="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Sankey-1-chromium-linux.png">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Dark-Theme-Sankey-1-chromium-linux.png">
    <img alt="Sankey" src="https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/snapshots.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Sankey-1-chromium-linux.png">
  </picture>
</a>

[More screenshots](https://github.com/andreasgerstmayr/fava-dashboards/tree/main/frontend/tests/e2e/snapshots.test.ts-snapshots)

## Installation
```
pip install fava-dashboards
```

Enable this plugin in Fava by adding the following lines to your ledger:
```
2010-01-01 custom "fava-extension" "fava_dashboards"
```

## Configuration
The plugin looks by default for a `dashboards.tsx` file (or `.ts`, `.jsx`, `.js`) in the directory of the Beancount ledger (e.g. if you run `fava personal.beancount`, the `dashboards.tsx` file should be in the same directory as `personal.beancount`).
The location of the `dashboards.tsx` configuration file can be customized:
```
2010-01-01 custom "fava-extension" "fava_dashboards" "{
    'config': '/path/to/dashboards.tsx'
}"
```

To get TypeScript type support, download [fava-dashboards.d.ts](example/fava-dashboards.d.ts) and place it next to `dashboards.tsx`.
Please take a look at the example dashboards configuration [dashboards.tsx](example/dashboards.tsx), which uses most of the functionality described below.

To convert a legacy `dashboards.yaml` file from version 1 to the new `dashboards.tsx` format, you can run `make deps && uv run scripts/convert_dashboards_yaml_to_tsx.py path/to/dashboards.yaml --output path/to/dashboards.tsx`.
This script covers most common cases, and does not perform TypeScript type inference.

The configuration file can contain multiple dashboards, and a dashboard contains one or more panels.
A panel has a relative width (e.g. `50%` for 2 columns, or `33.3%` for 3 column layouts) and a absolute height.

### Panel Properties
* `title`: title of the panel. Default: unset
* `width`: width of the panel. Default: 100%
* `height`: height of the panel. Default: 400px
* `link`: optional link target of the panel header.
* `kind`: panel kind. Must be one of `html`, `echarts`, `d3_sankey`, `table` or `react`.
* `spec`: a JavaScript function which generates a valid spec depending on the panel `kind`.

The following variables and functions are available:
* `panel`: the current panel definition
* `ledger.dateFirst`: start date of the current date filter, or first transaction date of the ledger
* `ledger.dateLast`: end date of the current date filter, or last transaction date of the ledger
* `ledger.filterFirst`: start date of the current date filter, or null if no date filter is set
* `ledger.filterLast`: end date of the current date filter, or null if no date filter is set
* `ledger.operatingCurrencies`: configured operating currencies of the ledger
* `ledger.ccy`: shortcut for the first configured operating currency of the ledger
* `ledger.accounts`: declared accounts of the ledger
* `ledger.commodities`: declared commodities of the ledger
* `ledger.query(bql)`: executes the specified BQL query
* `ledger.urlFor(url)`: add current Fava filter parameters to url

### HTML panel
The `spec` code of HTML panels must return valid HTML.
The HTML code will be rendered in the panel.

### ECharts panel
The `spec` code of [Apache ECharts](https://echarts.apache.org) panels must return valid [Apache ECharts](https://echarts.apache.org) chart options.
Please take a look at the [ECharts examples](https://echarts.apache.org/examples) to get familiar with the available chart types and options.

### d3-sankey panel
The `spec` code of d3-sankey panels must return valid d3-sankey chart options.
Please take a look at the example dashboard configuration [dashboards.tsx](example/dashboards.tsx).

### Table panel
The `spec` code of table panels must return valid [MUI X Data Grid](https://mui.com/x/react-data-grid/) props.

### React panel
The `spec` code of React panels must return a valid JSX element.
Please note that the code must not return a `Promise` (i.e. `async/await` is not supported).

## View Example Ledger
`cd example; fava example.beancount`

## Contributing
This plugin consists of a Python backend and a TypeScript frontend.

Install [uv](https://docs.astral.sh/uv/) and Node.js 22, run `make deps` to install the dependencies, and `make dev` to run the Fava dev server with auto-rebuild.

Before submitting a PR, please run `make build` to build the frontend in production mode, and add the compiled frontend to the PR.

## Articles
* [Dashboards with Beancount and Fava](https://www.andreasgerstmayr.at/2023/03/12/dashboards-with-beancount-and-fava.html)

## Related Projects
* [Fava Portfolio Returns](https://github.com/andreasgerstmayr/fava-portfolio-returns)
* [Fava Investor](https://github.com/redstreet/fava_investor)
* [Fava Classy Portfolio](https://github.com/seltzered/fava-classy-portfolio)

## Acknowledgements
Thanks to Martin Blais and all contributors of [Beancount](https://github.com/beancount/beancount),
Jakob Schnitzer, Dominik Aumayr and all contributors of [Fava](https://github.com/beancount/fava),
and to all contributors of [Apache ECharts](https://echarts.apache.org), [D3.js](https://d3js.org) and [d3-sankey](https://github.com/d3/d3-sankey).
