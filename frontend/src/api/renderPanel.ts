import * as v1 from "../model/v1";
import { fetchJSON } from "./api";

export interface RenderPanelResponse {
  panel: v1.Panel;
}

export async function renderPanel(panel: v1.Panel) {
  const params = new URLSearchParams(location.search);
  const url = `v1_render_panel?${params}`;

  const response = await fetchJSON<RenderPanelResponse>(url, { panel });
  return response.panel;
}
