import { renderApp } from "./app";

export type FavaExtenstionContext = unknown;

export default {
  onExtensionPageLoad(extensionContext: FavaExtenstionContext) {
    const container = document.getElementById("favaDashboardsApp");
    renderApp(container!, extensionContext);
  },
};
