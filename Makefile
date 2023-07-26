format:
	prettier -w fava_dashboards/static/*.js fava_dashboards/static/*.css tests/e2e/*.js
	black fava_dashboards/__init__.py scripts/format_js_in_dashboard.py
	./scripts/format_js_in_dashboard.py example/dashboards.yaml
	find . -name '*.beancount' -exec bean-format -c 59 -o "{}" "{}" \;
