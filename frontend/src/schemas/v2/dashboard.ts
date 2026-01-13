import type { SxProps } from "@mui/material/styles";
import { PanelKind, PanelSpecOf } from "../../panels/registry";
import { Ledger } from "./ledger";
import { MaybePromise } from "./utils";
import { ResolvedVariables, Variable } from "./variables";

export interface Config {
  dashboards: Dashboard[];
  theme?: {
    echarts?: object | string;
    dashboard?: {
      panel?: {
        style?: SxProps;
      };
    };
  };
}

export interface Dashboard {
  name: string;
  variables?: Variable[];
  panels: Panel[];
}

interface BasePanel {
  title?: string;
  width?: string;
  height?: string;
  link?: string;
  variables?: Variable[];
}

export type Panel = BasePanel &
  {
    [T in PanelKind]: {
      kind: T;
      spec: (params: SpecParams) => MaybePromise<PanelSpecOf<T>>;
    };
  }[PanelKind];

export type SpecParams = {
  panel: Panel;
  ledger: Ledger;
  variables: ResolvedVariables;
};

export function defineConfig(config: Config): Config {
  return config;
}
