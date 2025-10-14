# Fava Dashboards
[![Continuous Integration](https://github.com/andreasgerstmayr/fava-dashboards/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/andreasgerstmayr/fava-dashboards/actions/workflows/continuous-integration.yml)
[![PyPI](https://img.shields.io/pypi/v/fava-dashboards)](https://pypi.org/project/fava-dashboards/)

fava-dashboards allows creating custom dashboards in [Fava](https://github.com/beancount/fava).

Example dashboards with random data:
[![Overview](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Overview-1-chromium-linux.png)](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Overview-1-chromium-linux.png)
[![Assets](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Assets-1-chromium-linux.png)](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Assets-1-chromium-linux.png)
[![Income and Expenses](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Income-and-Expenses-1-chromium-linux.png)](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Income-and-Expenses-1-chromium-linux.png)
[![Travelling](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Travelling-1-chromium-linux.png)](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Travelling-1-chromium-linux.png)
[![Sankey](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Sankey-1-chromium-linux.png)](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Sankey-1-chromium-linux.png)
[![Projection](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Projection-1-chromium-linux.png)](https://github.com/andreasgerstmayr/fava-dashboards/raw/main/frontend/tests/e2e/dashboards.test.ts-snapshots/PNG-Snapshot-Tests-Light-Theme-Projection-1-chromium-linux.png)

## Installation
```
pip install fava-dashboards
```

Enable this plugin in Fava by adding the following lines to your ledger:
```
2010-01-01 custom "fava-extension" "fava_dashboards"
```

## Configuration
The plugin looks by default for a `dashboards.yaml` file in the directory of the Beancount ledger (e.g. if you run `fava personal.beancount`, the `dashboards.yaml` file should be in the same directory as `personal.beancount`).
The location of the `dashboards.yaml` configuration file can be customized:
```
2010-01-01 custom "fava-extension" "fava_dashboards" "{
    'config': '/path/to/dashboards.yaml'
}"
```

Please take a look at the example dashboards configuration [dashboards.yaml](example/dashboards.yaml), which uses most of the functionality described below.

The configuration file can contain multiple dashboards, and a dashboard contains one or more panels.
A panel has a relative width (e.g. `50%` for 2 columns, or `33.3%` for 3 column layouts) and a absolute height.

The `queries` field contains one or multiple queries.
The Beancount query must be stored in the `bql` field of the respective query.
It can contain Jinja template syntax to access the `panel` and `ledger` variables described below (example: use `{{ledger.ccy}}` to access the first configured operating currency).
Note that Jinja will replace some protected HTML characters with escapes.
For example, a `>` inside a Jinja variable will be turned into  `&gt`.
This can cause problems because `>` *is* a valid Beancount query operator, but `&gt` is not.
To skip replacing protected HTML characters, pass the [Jinja safe filter](https://jinja.palletsprojects.com/en/3.0.x/templates/#jinja-filters.safe) to your variable invokation (for example, `{{ panel.foo|safe }}`.

The query results can be accessed via `panel.queries[i].result`, where `i` is the index of the query in the `queries` field.
Note: Additionally to the Beancount query, Fava's filter bar further filters the available entries of the ledger.

Common code for utility functions can be defined in the dashboards configuration file, either inline in `utils.inline` or in an external file defined in `utils.path`.

**HTML, echarts and d3-sankey panels:**
The `script` field must contain valid JavaScript code.
It must return a valid configuration depending on the panel `type`.
The following variables and functions are available:
* `ext`: the Fava [`ExtensionContext`](https://github.com/beancount/fava/blob/main/frontend/src/extensions.ts)
* `ext.api.get("query", {bql: "SELECT ..."}`: executes the specified BQL query
* `panel`: the current (augmented) panel definition. The results of the BQL queries can be accessed with `panel.queries[i].result`.
* `ledger.dateFirst`: start date of the current date filter, or first transaction date of the ledger
* `ledger.dateLast`: end date of the current date filter, or last transaction date of the ledger
* `ledger.filterFirst`: start date of the current date filter, or null if no date filter is set
* `ledger.filterLast`: end date of the current date filter, or null if no date filter is set
* `ledger.operatingCurrencies`: configured operating currencies of the ledger
* `ledger.ccy`: shortcut for the first configured operating currency of the ledger
* `ledger.accounts`: declared accounts of the ledger
* `ledger.commodities`: declared commodities of the ledger
* `helpers.urlFor(url)`: add current Fava filter parameters to url
* `utils`: the return value of the `utils` code of the dashboard configuration

**Jinja2 panels:**
The `template` field must contain valid Jinja2 template code.
The following variables are available:
* `panel`: see above
* `ledger`: see above
* `favaledger`: a reference to the `FavaLedger` object

### Common Panel Properties
* `title`: title of the panel. Default: unset
* `width`: width of the panel. Default: 100%
* `height`: height of the panel. Default: 400px
* `link`: optional link target of the panel header.
* `queries`: a list of dicts with a `bql` attribute.
* `type`: panel type. Must be one of `html`, `echarts`, `d3_sankey` or `jinja2`.

### HTML panel
The `script` code of HTML panels must return valid HTML.
The HTML code will be rendered in the panel.

### ECharts panel
The `script` code of [Apache ECharts](https://echarts.apache.org) panels must return valid [Apache ECharts](https://echarts.apache.org) chart options.
Please take a look at the [ECharts examples](https://echarts.apache.org/examples) to get familiar with the available chart types and options.

### d3-sankey panel
The `script` code of d3-sankey panels must return valid d3-sankey chart options.
Please take a look at the example dashboard configuration [dashboards.yaml](example/dashboards.yaml).

### Jinja2 panel
The `template` field of Jinja2 panels must contain valid Jinja2 template code.
The rendered template will be shown in the panel.

## View Example Ledger
`cd example; fava example.beancount`

## Contributing
This plugin consists of a Python backend and a TypeScript frontend.

Install [uv](https://docs.astral.sh/uv/) and Node.js 22, run `make deps` to install the dependencies, and `make dev` to run the Fava dev server with auto-rebuild.

Before submitting a PR, please run `make build` to build the frontend in production mode, and add the compiled frontend to the PR.

## Why no React/Svelte/X?
The main reason is simplicity.
This project is small enough to use plain HTML/CSS/JS and Jinja2 templates only, and doesn't warrant using a modern and ever-changing web development toolchain.
Currently it requires only two external dependencies: pyyaml and echarts.

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
