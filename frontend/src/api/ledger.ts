import { useQuery } from "@tanstack/react-query";
import { useFavaFilterSearchParams } from "../routes/__root";
import { LedgerData } from "../schemas/v2/ledger";
import { fetchJSON } from "./api";

export interface LedgerDataResponse {
  ledgerData: LedgerData;
}

export function useLedgerData() {
  // ledger data must be refreshed if Fava filters change, because it contains for example dateFirst and dateLast
  const params = useFavaFilterSearchParams();
  const url = `v2_ledger?${params}`;

  return useQuery({
    queryKey: [url],
    queryFn: () => fetchJSON<LedgerDataResponse>(url),
  });
}
