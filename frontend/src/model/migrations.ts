import { renderPanel } from "../api/renderPanel";
import { runAsyncFunction } from "../components/utils";
import { FavaExtenstionContext } from "../extension";
import * as v2 from "./dashboard";
import * as v1 from "./v1";

export function migrate(
  dashboards: (v1.Dashboard | v2.Dashboard)[],
  utils: v1.Utils,
  extensionContext: FavaExtenstionContext,
): v2.Dashboard[] {
  return dashboards.map((dashboard) => ({
    ...dashboard,
    panels: dashboard.panels.map((panel) =>
      "render" in panel ? panel : migratePanelToV2(panel, utils, extensionContext),
    ),
  }));
}

function migratePanelToV2(v1Panel: v1.Panel, utils: v1.Utils, extensionContext: FavaExtenstionContext): v2.Panel {
  return {
    ...v1Panel,
    type: v1Panel.type === "jinja2" ? "html" : v1Panel.type,
    render: async (ctx: v2.RenderContext) => {
      const panel: v1.Panel = await renderPanel(v1Panel);
      if (panel.type === "jinja2" && panel.template) {
        return panel.template;
      }

      const panelCtx: v1.PanelCtx = {
        ext: extensionContext,
        ledger: ctx.ledger,
        fava: ctx.ledger,
        helpers: v1.helpers,
        utils,
        panel,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await runAsyncFunction(panel.script!, panelCtx)) as any;
    },
  };
}
