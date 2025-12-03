import { renderPanel } from "../api/renderPanel";
import { runAsyncFunction } from "../components/utils";
import { FavaExtenstionContext } from "../extension";
import * as v1 from "./v1/v1";
import * as dashboardv2 from "./v2/dashboard";

export function migrateV1ToV2(
  config: v1.Config,
  utils: v1.Utils,
  extensionContext: FavaExtenstionContext,
): dashboardv2.Config {
  return {
    ...config,
    dashboards: config.dashboards.map((dashboard) => ({
      ...dashboard,
      panels: dashboard.panels.map((panel) => migratePanelToV2(panel, utils, extensionContext)),
    })),
  };
}

function migratePanelToV2(
  v1Panel: v1.Panel,
  utils: v1.Utils,
  extensionContext: FavaExtenstionContext,
): dashboardv2.Panel {
  return {
    ...v1Panel,
    kind: v1Panel.type === "jinja2" ? "html" : v1Panel.type,
    spec: async (params) => {
      const panel: v1.Panel = await renderPanel(v1Panel);
      if (panel.type === "jinja2" && panel.template) {
        return panel.template;
      }

      const panelCtx: v1.PanelCtx = {
        ext: extensionContext,
        ledger: params.ledger,
        fava: params.ledger,
        helpers: v1.helpers,
        utils,
        panel,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await runAsyncFunction(panel.script!, panelCtx)) as any;
    },
  };
}
