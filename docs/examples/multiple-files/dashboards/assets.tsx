import { Dashboard } from "fava-dashboards";

export const assetsDashboard: Dashboard = {
  name: "Assets",
  panels: [
    {
      title: "Assets",
      kind: "html",
      spec: async () => {
        return "Assets Panel";
      },
    },
  ],
};
