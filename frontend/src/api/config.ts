import { useQuery } from "@tanstack/react-query";
import { Ledger } from "../model/dashboard";
import { fetchJSON } from "./api";

export interface ConfigResponse {
  ledger: Ledger;
  dashboardsJs: string;
  /** legacy utils object */
  utilsJs?: string;
}

export function useConfig() {
  const params = new URLSearchParams(location.search);
  const url = `v2_config?${params}`;

  return useQuery({
    queryKey: [url],
    queryFn: () => fetchJSON<ConfigResponse>(url),
  });
}
