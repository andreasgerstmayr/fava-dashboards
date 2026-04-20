# Multiple Files Example

This example shows how to split a `fava-dashboards` configuration across multiple TypeScript files.

Dashboard source files live in `dashboards/` and are bundled into `dashboards.js`.

Run `make build` after every change to any dashboard source file to regenerate the bundled `dashboards.js`.

Run `make fava` to build the dashboards and start Fava with the example ledger.
