export interface APIResponse<T> {
  success: boolean;
  error?: string;
  data: T;
}

export async function fetchJSON<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
  const init = data
    ? {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    : {};

  const response = await fetch(endpoint, init);
  const json = (await response.json()) as APIResponse<T>;
  if (!response.ok || !json.success) {
    throw new Error(json.error);
  }
  return json.data;
}

/** add Fava time, account and custom ledger filters */
export function createURLSearchParamsWithFavaFilters() {
  const params = new URLSearchParams();
  const currentParams = new URLSearchParams(location.search);

  for (const key of ["time", "account", "filter"]) {
    const value = currentParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  return params;
}
