import { Bootstrap, Dashboard, Ledger, Utils } from "./types";
import * as Panels from "./panels";
import * as helpers from "./helpers";
import { urlFor } from "./helpers";

function renderDashboard(ext: any, dashboard: Dashboard, ledger: Ledger, utils: Utils) {
    // add Fava filter parameters to panel links
    for (const elem of document.querySelectorAll(".panel a")) {
        const link = elem as HTMLAnchorElement;
        if (!link.getAttribute("href").includes("://")) {
            link.href = urlFor(link.href);
        }
    }

    // render panel
    for (let i = 0; i < dashboard.panels.length; i++) {
        const panel = dashboard.panels[i];
        if (!panel.type || !(panel.type in Panels)) {
            continue;
        }

        const elem = document.getElementById(`panel${i}`) as HTMLDivElement;
        const ctx = { ext, ledger, utils, helpers, panel };
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
