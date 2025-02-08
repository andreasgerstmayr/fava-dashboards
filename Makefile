default: run

## Dependencies
deps-js:
	cd frontend; npm install && npx puppeteer browsers install chrome

deps-js-update:
	cd frontend; npx npm-check-updates -i

deps-py:
	uv sync

deps-py-update:
	uv pip list --outdated
	uv lock --upgrade

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
	cd example; uv run fava example.beancount

dev:
	npx concurrently --names fava,esbuild "cd example; PYTHONUNBUFFERED=1 uv run fava --debug example.beancount" "cd frontend; npm run watch"

lint:
	cd frontend; npx tsc --noEmit
	uv run mypy src/fava_dashboards scripts/format_js_in_dashboard.py
	uv run pylint src/fava_dashboards scripts/format_js_in_dashboard.py

format:
	cd frontend; npx prettier -w . ../src/fava_dashboards/templates/*.css
	-uv run ruff check --fix
	uv run ruff format .
	find example -name '*.beancount' -exec uv run bean-format -c 59 -o "{}" "{}" \;
	./scripts/format_js_in_dashboard.py example/dashboards.yaml

ci:
	make lint
	make build
	make run &
	make test
	make format
	git diff --exit-code

## Container
container-run: container-stop
	docker build -t fava-dashboards-test -f Dockerfile.test .
	docker run -d --name fava-dashboards-test fava-dashboards-test

container-stop:
	docker rm -f fava-dashboards-test

container-test: container-run
	docker exec fava-dashboards-test make test
	make container-stop

container-test-js-update: container-run
	docker exec fava-dashboards-test make test-js-update
	docker cp fava-dashboards-test:/usr/src/app/frontend/tests/e2e/__snapshots__ ./frontend/tests/e2e
	docker cp fava-dashboards-test:/usr/src/app/frontend/tests/e2e/__image_snapshots__ ./frontend/tests/e2e
	make container-stop
