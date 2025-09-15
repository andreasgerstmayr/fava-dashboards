/* eslint-disable @typescript-eslint/no-explicit-any */

import * as helpers from "./v1_helpers";
export { helpers };

export interface PanelCtx {
  /** Fava [`ExtensionContext`](https://github.com/beancount/fava/blob/main/frontend/src/extensions.ts) */
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

export type Utils = Record<string, any>;

export interface Dashboard {
  name: string;
  panels: Panel[];
}

export interface Panel {
  title?: string;
  width?: string;
  height?: string;
  type: "html" | "jinja2" | "echarts" | "d3_sankey";
  script?: string;
  template?: string;
}

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
  accounts: Record<string, any>;

  /** declared commodities of the ledger */
  commodities: Record<string, any>;
}
