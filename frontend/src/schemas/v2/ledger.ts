import { QueryResult } from "../../api/query";

export type Ledger = LedgerData & LedgerApi;

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
