# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fava Dashboards is a custom dashboard extension for Fava (a web interface for Beancount accounting software). It allows users to create interactive dashboards with charts, metrics, and visualizations using their Beancount ledger data. The architecture consists of:

- **Python Backend**: Flask-based Fava extension that processes dashboard configurations, executes BQL queries, and renders Jinja2 templates
- **TypeScript Frontend**: Frontend components that render different panel types (HTML, ECharts, d3-sankey, Jinja2) in the browser
- **Configuration-driven**: Dashboards are defined in YAML files with embedded JavaScript/Jinja2 code

## Development Commands

### Frontend Development
```bash
# Install frontend dependencies
cd frontend && npm install

# Build the JavaScript bundle
cd frontend && npm run build

# Watch for changes and rebuild automatically
cd frontend && npm run watch

# Run end-to-end tests
cd frontend && npm run test
```

### Python Development
```bash
# Install Python dependencies
uv sync

# Run the example dashboard
cd example && uv run fava example.beancount

# Development mode with auto-reload
make dev
```

### Development Workflow Commands
```bash
# Format all code (Python, TypeScript, CSS)
make format

# Run linting and type checking
make lint

# Run tests
make test

# Build everything
make build
```

## Key Architecture Components

### Backend (`src/fava_dashboards/__init__.py`)
- `FavaDashboards` class extends `FavaExtensionBase`
- Processes dashboard YAML configuration files
- Executes BQL (Beancount Query Language) queries against ledger data
- Renders Jinja2 templates with ledger context
- Exposes `/query` API endpoint for dynamic queries

### Frontend (`frontend/src/`)
- `extension.ts`: Main entry point, renders dashboard panels
- `panels.ts`: Panel renderers for different types (HTML, ECharts, d3-sankey, Jinja2)
- `helpers.ts`: Utility functions for URL manipulation
- `types.ts`: TypeScript type definitions

### Panel Types
1. **HTML panels**: Execute JavaScript returning HTML strings
2. **ECharts panels**: Execute JavaScript returning ECharts configuration objects
3. **d3-sankey panels**: Execute JavaScript returning d3-sankey configuration
4. **Jinja2 panels**: Server-side template rendering with ledger context

### Configuration Structure
- Dashboard configuration is stored in `dashboards.yaml`
- Each dashboard contains multiple panels with queries, scripts, and styling
- Supports Jinja2 templating in BQL queries for dynamic content
- Common utility functions can be defined in `utils` section

## Testing

### E2E Tests
- Uses Playwright for browser automation
- Tests are in `frontend/tests/e2e/dashboards.test.ts`
- Generates visual regression tests (PNG snapshots)
- Tests both light and dark themes

### Running Tests
```bash
# Run all tests
make test

# Update visual snapshots
make test-js-update

# Run tests in Docker container
make container-test
```

## Build Process

The build process:
1. TypeScript compilation with esbuild
2. Bundles frontend code into `src/fava_dashboards/FavaDashboards.js`
3. Python packaging with hatchling

## Common Development Patterns

### Adding New Panel Types
1. Add type definition to `types.ts`
2. Implement renderer in `panels.ts`
3. Update the panel type check in `extension.ts`

### Dashboard Configuration
- BQL queries support Jinja2 templating with `{{ledger.ccy}}`, `{{panel.field}}` syntax
- Use `|safe` filter for HTML content in Jinja2 templates
- Panel scripts have access to `ext`, `panel`, `ledger`, `helpers`, and `utils` objects

### Code Quality
- Uses Prettier for TypeScript/CSS formatting
- Uses Ruff for Python code formatting and linting
- MyPy for Python type checking
- ESLint-style TypeScript compilation checking