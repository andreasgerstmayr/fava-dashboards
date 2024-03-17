import { Bootstrap, Dashboard, Ledger, Utils } from "./types";
import * as Panels from "./panels";

function renderDashboard(ext: any, dashboard: Dashboard, ledger: Ledger, utils: Utils) {
    for (let i = 0; i < dashboard.panels.length; i++) {
        const panel = dashboard.panels[i];
        if (!panel.type || !(panel.type in Panels)) {
            continue;
        }

        const elem = document.getElementById(`panel${i}`) as HTMLDivElement;
        const ctx = { ext, ledger, utils, panel };
        Panels[panel.type](ctx, elem);
    }
}

export default {
    onExtensionPageLoad(ext: any) {
        const boostrapJSON = (document.querySelector("#favaDashboardsBootstrap") as HTMLScriptElement)?.text;
        if (!boostrapJSON) return;

        const bootstrap: Bootstrap = JSON.parse(boostrapJSON);
        const utils: Utils = new Function(bootstrap.utils)();
        renderDashboard(ext, bootstrap.dashboard, bootstrap.ledger, utils);
    },
};
