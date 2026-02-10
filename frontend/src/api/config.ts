import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "./api";

export interface ConfigResponse {
  configJs: string;
  /** legacy utils object */
  utilsJs?: string;
}

export function useConfig() {
  const url = `v2_config`;

  return useQuery({
    queryKey: [url],
    queryFn: () => fetchJSON<ConfigResponse>(url),
  });
}
