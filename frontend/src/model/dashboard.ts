import { EChartsOption } from "echarts";
import { SankeyOptions } from "../components/D3Sankey";

type MaybePromise<T> = T | Promise<T>;

export interface Dashboard {
  name: string;
  panels: Panel[];
}

export type Panel = HTMLPanel | EChartsPanel | D3SankeyPanel;

interface BasePanel {
  title?: string;
  description?: string;
  link?: string;
  width?: string | number;
  height?: string | number;
}

interface HTMLPanel extends BasePanel {
  type: "html";
  render: (ctx: RenderContext) => MaybePromise<string>;
}

interface EChartsPanel extends BasePanel {
  type: "echarts";
  render: (ctx: RenderContext) => MaybePromise<EChartsOption>;
}

interface D3SankeyPanel extends BasePanel {
  type: "d3_sankey";
  render: (ctx: RenderContext) => MaybePromise<SankeyOptions>;
}

export interface RenderContext {
  /** the panel which is being rendered */
  panel: Panel;

  /** the ledger */
  ledger: Ledger;
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
  accounts: Record<string, Account>;

  /** declared commodities of the ledger */
  commodities: Record<string, Commodity>;
}

interface Account {
  meta: Record<string, string>;
}

interface Commodity {
  currency: string;
  meta: Record<string, string>;
}
