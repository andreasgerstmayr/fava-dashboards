default: run

## Dependencies
deps-js:
	cd frontend; npm install

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

build-dts:
	cd frontend; npm run build:dts

build: build-js build-dts

test-py:
	uv run pytest

test-js:
	cd frontend; LANG=en npm run test

test-js-update:
	cd frontend; LANG=en npm run test -- -u

test-js-ui:
	cd frontend; LANG=en npm run test -- --ui

test: test-py test-js

## Utils
run:
	cd example; uv run fava example.beancount

dev:
	npx concurrently --names fava,esbuild \
	  "PYTHONUNBUFFERED=1 uv run fava --debug example/example.beancount frontend/tests/dashboards/*.beancount" \
	  "cd frontend; npm install && npm run watch"

lint:
	cd frontend; npm run type-check
	cd frontend; npm run lint
	uv run mypy src/fava_dashboards scripts
	uv run pylint src/fava_dashboards scripts

format:
	-cd frontend; npm run lint:fix
	-uv run ruff check --fix
	uv run ruff format .
	find example frontend/tests/dashboards -name '*.beancount' -exec uv run bean-format -c 59 -o "{}" "{}" \;

## Container
container-run: container-stop
	docker build -t fava-dashboards-test -f Dockerfile.test .
	docker run -d --name fava-dashboards-test fava-dashboards-test
	docker exec fava-dashboards-test curl --retry 10 --retry-connrefused --silent --output /dev/null http://127.0.0.1:5000

container-stop:
	docker rm -f fava-dashboards-test

container-test: container-run
	docker exec fava-dashboards-test make test || (rm -rf ./frontend/test-results && docker cp fava-dashboards-test:/usr/src/app/frontend/test-results ./frontend && exit 1)
	make container-stop

container-test-js-update: container-run
	docker exec fava-dashboards-test make test-js-update
	docker cp fava-dashboards-test:/usr/src/app/frontend/tests/e2e/snapshots.test.ts-snapshots ./frontend/tests/e2e
	make container-stop
