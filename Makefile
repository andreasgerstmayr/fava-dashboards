default: run

## Dependencies
deps-js:
	cd frontend; npm install && npx puppeteer browsers install chrome

deps-js-update:
	cd frontend; npx npm-check-updates -i

deps-py:
	pipenv install -d

deps-py-update:
	pipenv update

deps: deps-js deps-py

## Build and Test
build-js:
	cd frontend; npm run build

build: build-js

watch-js:
	cd frontend; npm run watch

test-js:
	cd frontend; LANG=en npm run test

test-js-update:
	cd frontend; LANG=en npm run test -- -u

test: test-js

## Utils
run:
	cd example; pipenv run fava example.beancount

run-debug:
	cd example; pipenv run fava --debug example.beancount

lint:
	cd frontend; npx tsc --noEmit
	pipenv run mypy src/fava_dashboards/__init__.py scripts/format_js_in_dashboard.py
	pipenv run pylint src/fava_dashboards/__init__.py scripts/format_js_in_dashboard.py

format:
	cd frontend; npx prettier -w . ../src/fava_dashboards/templates/*.css
	pipenv run black src/fava_dashboards/__init__.py scripts/format_js_in_dashboard.py
	find example -name '*.beancount' -exec pipenv run bean-format -c 59 -o "{}" "{}" \;
	./scripts/format_js_in_dashboard.py example/dashboards.yaml

ci:
	make lint
	make build
	make run &
	make test

	make format
	git diff --exit-code
