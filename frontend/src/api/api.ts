export interface APIResponse<T> {
  success: boolean;
  error?: string;
  data: T;
}

export async function fetchJSON<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  const json = (await response.json()) as APIResponse<T>;
  if (!response.ok || !json.success) {
    throw new Error(json.error);
  }
  return json.data;
}
