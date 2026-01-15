# Changelog

## next
* fix panel link href
* migrate to `@tanstack/router` and URLs from `/beancount/extension/FavaDashboards/#/dashboards/income-and-expenses` to `/beancount/extension/FavaDashboards/?dashboard=income-and-expenses`.
  This resolves a bug when using [custom links with `/jump`](https://fava.pythonanywhere.com/example-beancount-file/help/features#custom-links-in-the-sidebar) in Fava.

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
