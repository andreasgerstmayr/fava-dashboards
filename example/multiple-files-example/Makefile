default: fava

deps:
	npm install

build: deps
	npm run build

fava: build
	uv run fava example.beancount
