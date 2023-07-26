build:
	cd frontend; npm run build

test:
	cd frontend; npm run test

format:
	prettier -w frontend fava_dashboards/static/*.css
	black fava_dashboards/__init__.py scripts/format_js_in_dashboard.py
	./scripts/format_js_in_dashboard.py example/dashboards.yaml
	find . -name '*.beancount' -exec bean-format -c 59 -o "{}" "{}" \;
