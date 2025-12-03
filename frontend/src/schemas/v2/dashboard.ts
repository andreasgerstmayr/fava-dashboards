import { PanelKind, PanelSpecOf } from "../../panels/registry";
import { Ledger } from "./ledger";
import { MaybePromise } from "./utils";
import { VariableDefinition, VariablesContents } from "./variables";

export interface Config {
  dashboards: Dashboard[];
}

export interface Dashboard {
  name: string;
  variables?: VariableDefinition[];
  panels: Panel[];
}

interface BasePanel {
  title?: string;
  width?: string;
  height?: string;
  link?: string;
  variables?: VariableDefinition[];
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
  variables: VariablesContents;
};
