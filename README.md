# Fava Dashboards
fava-dashboards allows creating custom dashboards in [Fava](https://github.com/beancount/fava).

[![Overview](example/overview.png)](example/overview.png)
[![Expenses](example/expenses.png)](example/expenses.png)

## Installation
```
pip install git+https://github.com/andreasgerstmayr/fava-dashboards.git
```

Enable this plugin in Fava by adding the following lines to your ledger:
```
2010-01-01 custom "fava-extension" "fava_dashboards"
```

## Configuration
Please take a look at the example dashboard configuration [dashboards.yaml](example/dashboards.yaml), which uses most of the functionality described below.

The configuration file can contain multiple dashboards, and a dashboard contains one or more panels.
A panel has a relative width (e.g. `50%` for 2 columns, or `33.3%` for 3 column layouts) and a absolute height.
Currently there are two kinds of panels: Charts and HTML.

### Charts
Chart panels can contain a `queries` field and must contain a `chart` field.

The `queries` field contains one or multiple queries. The beancount query must be stored in the `bql` field of the respectiv query.
The query results can be accessed via `panel.queries[i].result`, where `i` is the index of the query in the `queries` field.

The `chart` field must contain valid JavaScript code and must return a valid [Apache ECharts](https://echarts.apache.org) configuration.
Please take a look at the [ECharts examples](https://echarts.apache.org/examples) to get familiar with the available chart types and options.

For convenience a `utils.months` and `utils.years` variable is accessible in the JavaScript code, containing a list of years/months of the current selected time frame.

Note: Additionally to the beancount query, Fava's filter bar further filters the available entries of the ledger.

### HTML
HTML panels must contain a `html` field with HTML code.
This code will be rendered in the panel.

## View Example Ledger
`cd example; fava example.beancount`

## Why no React/Svelte/X?
The main reason is simplicity.
This project is small enough to use plain HTML/CSS/JS and Jinja2 templates only, and doesn't warrant using a modern and ever-changing web development toolchain.
Currently it requires only two external dependencies: pyyaml and echarts.

## Related Projects
* [Fava Portfolio Returns](https://github.com/andreasgerstmayr/fava-portfolio-returns)

## Acknowledgements
Thanks to Martin Blais and all contributors of [beancount](https://github.com/beancount/beancount),
Jakob Schnitzer, Dominik Aumayr and all contributors of [Fava](https://github.com/beancount/fava),
and to all contributors of [Apache ECharts](https://echarts.apache.org).
