import * as v1 from "../schemas/v1/v1";
import { createURLSearchParamsWithFavaFilters, fetchJSON } from "./api";

export interface RenderPanelResponse {
  panel: v1.Panel;
}

/** @deprecated */
export async function renderPanel(panel: v1.Panel) {
  const params = createURLSearchParamsWithFavaFilters();
  const url = `v1_render_panel?${params}`;

  const response = await fetchJSON<RenderPanelResponse>(url, { panel });
  return response.panel;
}
