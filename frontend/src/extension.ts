import * as echarts from "echarts";
import * as helpers from "./helpers";
import { render_d3sankey } from "./sankey";
import { Dashboard, Ledger, Panel as PanelType } from "./types";

class Panel {
    static runScript(ledger: Ledger, panel: PanelType) {
        // pass 'fava' for backwards compatibility
        const scriptFn = new Function("panel", "ledger", "fava", "helpers", panel.script!);
        return scriptFn(panel, ledger, ledger, helpers);
    }

    static html(ledger: Ledger, panel: PanelType, elem: HTMLDivElement) {
        try {
            elem.innerHTML = Panel.runScript(ledger, panel);
        } catch (e) {
            elem.innerHTML = e;
        }
    }

    static echarts(ledger: Ledger, panel: PanelType, elem: HTMLDivElement) {
        let options;
        try {
            options = Panel.runScript(ledger, panel);
        } catch (e) {
            elem.innerHTML = e;
            return;
        }

        const chart = echarts.init(elem);
        //const chart = echarts.init(elem, null, { renderer: "svg" });
        if (options.onClick) {
            chart.on("click", options.onClick);
            delete options.onClick;
        }
        if (options.onDblClick) {
            chart.on("dblclick", options.onDblClick);
            delete options.onDblClick;
        }
        chart.setOption(options);
    }

    static d3_sankey(ledger: Ledger, panel: PanelType, elem: HTMLDivElement) {
        let options;
        try {
            options = Panel.runScript(ledger, panel);
        } catch (e) {
            elem.innerHTML = e;
            return;
        }

        render_d3sankey(elem, options);
    }

    static jinja2(ledger: Ledger, panel: PanelType, elem: HTMLDivElement) {
        elem.innerHTML = panel.template!;
    }
}

function renderDashboard(ledger: Ledger, dashboard: Dashboard) {
    for (let i = 0; i < dashboard.panels.length; i++) {
        const panel = dashboard.panels[i];
        if (!panel.type) {
            continue;
        }

        const elem = document.getElementById(`panel${i}`);
        if (panel.type in Panel) {
            Panel[panel.type](ledger, panel, elem as HTMLDivElement);
        }
    }
}

export default {
    onExtensionPageLoad() {
        const boostrapJSON = (document.querySelector("#favaDashboardsBootstrap") as HTMLScriptElement)?.text;
        if (!boostrapJSON) return;

        const bootstrap = JSON.parse(boostrapJSON);
        const ledger = bootstrap.ledger;
        const dashboard = bootstrap.dashboards[bootstrap.dashboardId];

        renderDashboard(ledger, dashboard);
    },
};
