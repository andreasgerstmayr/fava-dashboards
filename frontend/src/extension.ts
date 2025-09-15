import { renderApp } from "./app";

export default {
  onExtensionPageLoad() {
    const container = document.getElementById("favaDashboardsApp");
    renderApp(container!);
  },
};
