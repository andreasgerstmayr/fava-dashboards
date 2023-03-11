format:
	prettier -w fava_dashboards/static/*.js fava_dashboards/static/*.css
	black fava_dashboards/__init__.py scripts/format_js_in_dashboard.py
