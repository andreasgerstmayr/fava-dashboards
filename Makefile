deps-js:
	cd frontend; npm install && npx puppeteer browsers install chrome

deps-py:
	cd example; pipenv install -d

deps: deps-js deps-py

build-js:
	cd frontend; npm run build

watch-js:
	cd frontend; npm run watch

test-js:
	cd frontend; LANG=en npm run test

test-js-update:
	cd frontend; LANG=en npm run test -- -u

run:
	cd example; pipenv run fava example.beancount

run-debug:
	cd example; pipenv run fava --debug example.beancount

format:
	cd frontend; npx prettier -w . ../src/fava_dashboards/templates/*.css
	cd example; pipenv run black ../src/fava_dashboards/__init__.py ../scripts/format_js_in_dashboard.py
	cd example; find . -name '*.beancount' -exec pipenv run bean-format -c 59 -o "{}" "{}" \;
	./scripts/format_js_in_dashboard.py example/dashboards.yaml

ci:
	make build-js
	make run &
	make test-js

	make format
	git diff --exit-code
