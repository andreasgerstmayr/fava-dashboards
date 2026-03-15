import { Dashboard } from "fava-dashboards";

export const incomeDashboard: Dashboard = {
  name: "Income",
  panels: [
    {
      title: "Income",
      kind: "html",
      spec: async () => {
        return "Income Panel";
      },
    },
  ],
};
