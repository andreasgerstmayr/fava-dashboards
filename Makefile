frontend/node_modules: frontend/package-lock.json
	cd frontend; npm install
	touch -m frontend/node_modules

.PHONY: build
build: frontend/node_modules
	cd frontend; npm run build

.PHONY: watch
watch: frontend/node_modules
	cd frontend; npm run watch

.PHONY: test
test: frontend/node_modules
	cd frontend; npm run test

.PHONY: format
format:
	prettier -w frontend src/fava_dashboards/templates/*.css
	black src/fava_dashboards/__init__.py scripts/format_js_in_dashboard.py
	./scripts/format_js_in_dashboard.py example/dashboards.yaml
	find example -name '*.beancount' -exec bean-format -c 59 -o "{}" "{}" \;
