import { fetchJSON } from "./api";

export interface QueryResponse {
  result: any[];
}

export async function query(bql: string) {
  const params = new URLSearchParams(location.search);
  params.set("bql", bql);
  const url = `query?${params}`;

  const response = await fetchJSON<QueryResponse>(url);
  return response.result;
}
