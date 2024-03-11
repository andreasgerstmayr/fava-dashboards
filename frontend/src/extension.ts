import * as echarts from "echarts";
import * as helpers from "./helpers";
import { render_d3sankey } from "./sankey";
import { Dashboard, Ledger, Panel as PanelType, Utils } from "./types";

class Panel {
    static runScript(ledger: Ledger, utils: Utils, panel: PanelType) {
        // pass 'fava' and 'helpers' for backwards compatibility
        const scriptFn = new Function("panel", "ledger", "fava", "helpers", "utils", panel.script!);
        return scriptFn(panel, ledger, ledger, helpers, utils);
    }

    static html(ledger: Ledger, utils: Utils, panel: PanelType, elem: HTMLDivElement) {
        try {
            elem.innerHTML = Panel.runScript(ledger, utils, panel);
        } catch (e) {
            elem.innerHTML = e;
        }
    }

    static echarts(ledger: Ledger, utils: Utils, panel: PanelType, elem: HTMLDivElement) {
        let options;
        try {
            options = Panel.runScript(ledger, utils, panel);
        } catch (e) {
            elem.innerHTML = e;
            return;
        }

        const renderer = window.navigator.userAgent === "puppeteer" ? "svg" : undefined;
        const chart = echarts.init(elem, undefined, { renderer });
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

    static d3_sankey(ledger: Ledger, utils: Utils, panel: PanelType, elem: HTMLDivElement) {
        let options;
        try {
            options = Panel.runScript(ledger, utils, panel);
        } catch (e) {
            elem.innerHTML = e;
            return;
        }

        render_d3sankey(elem, options);
    }

    static jinja2(ledger: Ledger, utils: Utils, panel: PanelType, elem: HTMLDivElement) {
        elem.innerHTML = panel.template!;
    }
}

function renderDashboard(ledger: Ledger, dashboard: Dashboard, utils: Utils) {
    for (let i = 0; i < dashboard.panels.length; i++) {
        const panel = dashboard.panels[i];
        if (!panel.type || !(panel.type in Panel)) {
            continue;
        }

        const elem = document.getElementById(`panel${i}`);
        Panel[panel.type](ledger, utils, panel, elem as HTMLDivElement);
    }
}

export default {
    onExtensionPageLoad() {
        const boostrapJSON = (document.querySelector("#favaDashboardsBootstrap") as HTMLScriptElement)?.text;
        if (!boostrapJSON) return;

        const bootstrap = JSON.parse(boostrapJSON);
        const utils = new Function(bootstrap.utils)();
        renderDashboard(bootstrap.ledger, bootstrap.dashboard, utils);
    },
};
