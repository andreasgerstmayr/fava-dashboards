# Changelog

## v2.0.0b5 (2026-02-12)
* dev: optionally specify ledger file in make dev [#140](https://github.com/andreasgerstmayr/fava-dashboards/pull/140) ([@Evernight](https://github.com/Evernight))
* fix: refresh panels if any filter changes [#169](https://github.com/andreasgerstmayr/fava-dashboards/pull/169) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* example: fix monthly income/expense/savings for months without transactions [#168](https://github.com/andreasgerstmayr/fava-dashboards/pull/168) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* add ty [#166](https://github.com/andreasgerstmayr/fava-dashboards/pull/166) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* update deps [#165](https://github.com/andreasgerstmayr/fava-dashboards/pull/165) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))

## v2.0.0b4 (2026-01-23)
* skip snapshot tests unless inside container [#163](https://github.com/andreasgerstmayr/fava-dashboards/pull/163) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* retain Fava filters when navigating from outside to plugin [#161](https://github.com/andreasgerstmayr/fava-dashboards/pull/161) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* refresh data if Fava filter changes [#160](https://github.com/andreasgerstmayr/fava-dashboards/pull/160) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))

## v2.0.0b3 (2026-01-15)
* migrate to `@tanstack/router` and URLs from `/beancount/extension/FavaDashboards/#/dashboards/income-and-expenses` to `/beancount/extension/FavaDashboards/?dashboard=income-and-expenses` [#143](https://github.com/andreasgerstmayr/fava-dashboards/pull/143) ([@andreasgerstmayr](https://github.com/andreasgerstmayr)).
  This resolves a bug when using [custom links with `/jump`](https://fava.pythonanywhere.com/example-beancount-file/help/features#custom-links-in-the-sidebar) in Fava.
* support custom ECharts themes [#129](https://github.com/andreasgerstmayr/fava-dashboards/pull/129) ([@Evernight](https://github.com/Evernight))
* add dashboards.yaml to dashboards.tsx conversion script [#151](https://github.com/andreasgerstmayr/fava-dashboards/pull/151) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* feat: support styling of variable selects [#147](https://github.com/andreasgerstmayr/fava-dashboards/pull/147) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* rename VariableDefinition to Variable [#145](https://github.com/andreasgerstmayr/fava-dashboards/pull/145) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* example: stack yearly travel chart [#135](https://github.com/andreasgerstmayr/fava-dashboards/pull/135) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* example: use dynamic panel height for travel destinations panel [#134](https://github.com/andreasgerstmayr/fava-dashboards/pull/134) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* example: add stacked Year-over-Year chart option [#132](https://github.com/andreasgerstmayr/fava-dashboards/pull/132) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* fix panel link href [#128](https://github.com/andreasgerstmayr/fava-dashboards/pull/128) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))
* fix links [#158](https://github.com/andreasgerstmayr/fava-dashboards/pull/158) ([@andreasgerstmayr](https://github.com/andreasgerstmayr))

## v2.0.0b2 (2025-12-14)
* support Fava 1.30.8

## v2.0.0b1 (2025-12-03)
### Added
* support dynamic, typed dashboards written in TypeScript (`dashboards.tsx`) or JavaScript (`dashboards.jsx`)
* variables per dashboard and per panel
* concurrent loading of panels
* new `react` panel kind

### Changed
* updated design using Material UI

### Removed
* the `jinja2` panel type is deprecated in TypeScript/JavaScript dashboards

Legacy `dashboards.yaml` configurations will be migrated transparently and are expected to work.

## v1.2.2 (2026-01-01)
* show error when using the new dashboard format (`.ts[x]`, `.js[x]`) in v1 (this format is only supported in v2+)

## v1.2.1 (2025-12-14)
* support Fava 1.30.8

## v1.2.0 (2025-10-15)
* upgrade echarts to v6.0.0

## v1.1.0 (2025-10-15)
* publish releases to [PyPI](https://pypi.org/project/fava-dashboards/)

## v1.0.0 (2023-03-08)
* initial version
