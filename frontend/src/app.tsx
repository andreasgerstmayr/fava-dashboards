import React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "./navigation";
import { Dashboard } from "./dashboard";
import { Bootstrap } from "./types";

type AppProps = {
    bootstrap: Bootstrap;
};

const App = ({ bootstrap }: AppProps) => (
    <>
        <Navigation dashboards={bootstrap.dashboards} dashboardId={bootstrap.dashboardId} />
        <Dashboard dashboard={bootstrap.dashboards[bootstrap.dashboardId]} ledger={bootstrap.ledger} />
    </>
);

export default {
    onExtensionPageLoad() {
        const boostrapJSON = (document.querySelector("#favaDashboardsBootstrap") as HTMLScriptElement)?.text;
        if (!boostrapJSON) return;

        const appDom = document.querySelector("#favaDashboardsApp");
        if (!appDom) return;

        const bootstrap = JSON.parse(boostrapJSON);
        createRoot(appDom).render(<App bootstrap={bootstrap} />);
    },
};
