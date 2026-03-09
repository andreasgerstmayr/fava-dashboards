import { defineConfig } from "fava-dashboards";
import { assetsDashboard } from "./assets";
import { incomeDashboard } from "./income";

export default defineConfig({
  dashboards: [incomeDashboard, assetsDashboard],
});
