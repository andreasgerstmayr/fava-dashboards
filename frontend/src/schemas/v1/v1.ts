import * as z from "zod";
import * as helpers from "./v1_helpers";
export { helpers };

const ZQuery = z.looseObject({
  bql: z.string(),
});

const ZPanel = z.looseObject({
  title: z.string().default(""),
  width: z.string().default("100%"),
  height: z.string().default("400px"),
  link: z.string().optional(),
  queries: z.array(ZQuery).optional(),
  type: z.enum(["html", "echarts", "d3_sankey", "jinja2"]),
  script: z.string().optional(),
  template: z.string().optional(),
});

const ZDashboard = z.object({
  name: z.string(),
  panels: z.array(ZPanel),
});

export const ZConfig = z.object({
  dashboards: z.array(ZDashboard),
});

export type Config = z.infer<typeof ZConfig>;
export type Panel = z.infer<typeof ZPanel>;

export interface PanelCtx {
  /** Fava [`ExtensionContext`](https://github.com/beancount/fava/blob/main/frontend/src/extensions.ts) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ext: any;

  /** metadata of the Beancount ledger */
  ledger: Ledger;

  /** backwards compat for ledger */
  fava: Ledger;

  /** various helper functions */
  helpers: typeof helpers;

  /** return value of the `utils` code of the dashboard configuration */
  utils: Utils;

  /** current (augmented) panel definition. The results of the BQL queries can be accessed with `panel.queries[i].result`. */
  panel: Panel;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Utils = Record<string, any>;

export interface Ledger {
  /** first date in the current date filter */
  dateFirst: string;

  /** last date in the current date filter */
  dateLast: string;

  /** configured operating currencies of the ledger */
  operatingCurrencies: string[];

  /** shortcut for the first configured operating currency of the ledger */
  ccy: string;

  /** declared accounts of the ledger */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accounts: Record<string, any>;

  /** declared commodities of the ledger */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commodities: Record<string, any>;
}
