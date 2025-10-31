import { useQuery } from "@tanstack/react-query";
import { LedgerData } from "../schemas/v2";
import { fetchJSON } from "./api";

export interface ConfigResponse {
  ledgerData: LedgerData;
  configJs: string;
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
