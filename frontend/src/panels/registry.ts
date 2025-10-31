import { D3SankeyPanel } from "./D3SankeyPanel";
import { EChartsPanel } from "./EChartsPanel";
import { HtmlPanel } from "./HtmlPanel";
import { ReactPanel } from "./ReactPanel";
import { TablePanel } from "./TablePanel";

export interface PanelProps<T> {
  spec: T;
}

type PanelRegistry = typeof panelRegistry;
export type PanelKind = keyof PanelRegistry;
export type PanelSpecOf<T extends PanelKind> = Parameters<PanelRegistry[T]>[0]["spec"];

export const panelRegistry = {
  html: HtmlPanel,
  echarts: EChartsPanel,
  d3_sankey: D3SankeyPanel,
  table: TablePanel,
  react: ReactPanel,
} as const;
export const panelKinds = Object.keys(panelRegistry) as PanelKind[];
