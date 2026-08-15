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

test-e2e:
	docker build -t fava-dashboards-test -f Dockerfile.e2e .
	-docker rm -f fava-dashboards-test
	docker run --name fava-dashboards-test -e DISABLE_SNAPSHOT_TESTS fava-dashboards-test || (rm -rf ./frontend/test-results && docker cp fava-dashboards-test:/usr/src/app/frontend/test-results ./frontend && exit 1)

test-e2e-update:
	docker build -t fava-dashboards-test -f Dockerfile.e2e .
	-docker rm -f fava-dashboards-test
	-docker run --name fava-dashboards-test fava-dashboards-test --update-snapshots
	docker cp fava-dashboards-test:/usr/src/app/frontend/tests/e2e/snapshots.test.ts-snapshots ./frontend/tests/e2e

test: test-py

## Utils
LEDGER_FILE ?= $(wildcard example/*.beancount frontend/tests/dashboards/[!_]*.beancount frontend/tests/dashboards/*/*.beancount)

run:
	uv run fava $(LEDGER_FILE)

# Development with live reload (parametrizable beancount file path)
# Usage: make dev LEDGER_FILE=path/to/file.beancount
dev:
	npx concurrently --names fava,esbuild \
	  "PYTHONUNBUFFERED=1 uv run fava --debug $(LEDGER_FILE)" \
	  "cd frontend; npm install && npm run watch"

lint:
	cd frontend; npm run type-check
	cd frontend; npm run lint
	uv run ty check
	uv run mypy src/fava_dashboards scripts
	uv run pylint src/fava_dashboards scripts

format:
	-cd frontend; npm run lint:fix
	-uv run ruff check --fix
	uv run ruff format .
	find example frontend/tests/dashboards -name '*.beancount' -exec uv run bean-format -c 59 -o "{}" "{}" \;
