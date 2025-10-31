import { fetchJSON } from "./api";

export interface QueryResponse<T> {
  result: QueryResult<T>;
}

export type QueryResult<T> = T[];
export type Inventory = Record<string, number>;
export interface Position {
  units: Amount;
  cost?: Cost;
}
export interface Cost {
  number: number;
  currency: string;
  date: string;
}
export interface Amount {
  number: number;
  currency: string;
}

export async function query<T>(bql: string): Promise<QueryResult<T>> {
  const params = new URLSearchParams(location.search);
  params.set("bql", bql);
  const url = `query?${params}`;

  const response = await fetchJSON<QueryResponse<T>>(url);
  return response.result;
}
