import * as z from "zod";
import { QueryResult } from "../api/query";
import { PanelKind, panelKinds, PanelSpecOf } from "../panels/registry";

export function defineConfig(config: Config): Config {
  return config;
}

type MaybePromise<T> = T | Promise<T>;
export type RenderContext = {
  panel: Panel;
  ledger: Ledger;
};

export interface Config {
  dashboards: Dashboard[];
}

export interface Dashboard {
  name: string;
  panels: Panel[];
}

interface BasePanel {
  title?: string;
  width?: string;
  height?: string;
  link?: string;
}

export type Panel = BasePanel &
  {
    [T in PanelKind]: {
      kind: T;
      spec: (ctx: RenderContext) => MaybePromise<PanelSpecOf<T>>;
    };
  }[PanelKind];

export interface LedgerData {
  /** start date of the current date filter, or first transaction date of the ledger */
  dateFirst: string;

  /** end date of the current date filter, or last transaction date of the ledger */
  dateLast: string;

  /** start date of the current date filter, or undefined if no date filter is set */
  filterFirst?: string;

  /** end date of the current date filter, or undefined if no date filter is set */
  filterLast?: string;

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
  meta: Record<string, string | number>;
}

interface Commodity {
  currency: string;
  meta: Record<string, string | number>;
}

interface LedgerApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query<T = any>(bql: string): Promise<QueryResult<T>>;
  urlFor(url: string): string;
}

export type Ledger = LedgerData & LedgerApi;

const ZBasePanel = z.object({
  title: z.string().optional(),
  width: z.string().default("100%"),
  height: z.string().default("400px"),
  link: z.string().optional(),
});

const ZPanel = ZBasePanel.extend({
  kind: z.enum(panelKinds),
  spec: z.any(),
});

const ZDashboard = z.object({
  name: z.string(),
  panels: z.array(ZPanel),
});

export const ZConfig = z.object({
  dashboards: z.array(ZDashboard),
});
