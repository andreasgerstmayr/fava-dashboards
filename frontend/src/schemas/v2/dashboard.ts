import type { SxProps } from "@mui/material/styles";
import { EChartsThemeName } from "../../panels/echarts/EChartsPanel";
import { PanelKind, PanelSpecOf } from "../../panels/registry";
import { Ledger } from "./ledger";
import { MaybePromise } from "./utils";
import { ResolvedVariables, VariableInput } from "./variables";

// Ideally, we'd expose z.input<typeof ...Schema>; however, the inferred types are not easily readable

export interface ConfigInput {
  dashboards: DashboardInput[];
  theme?: ThemeInput;
}

interface ThemeInput {
  echarts?: EChartsThemeName | object;
  dashboard?: {
    panel?: {
      style?: SxProps;
    };
  };
}

export interface DashboardInput {
  name: string;
  variables?: VariableInput[];
  panels: PanelInput[];
}

interface BasePanelInput {
  title?: string;
  width?: string;
  height?: string;
  link?: string;
  variables?: VariableInput[];
}

export type PanelInput = BasePanelInput &
  {
    [T in PanelKind]: {
      kind: T;
      spec: (params: SpecParams) => MaybePromise<PanelSpecOf<T>>;
    };
  }[PanelKind];

export type SpecParams = {
  panel: PanelInput;
  ledger: Ledger;
  variables: ResolvedVariables;
};

export function defineConfig(config: ConfigInput): ConfigInput {
  return config;
}
