import { Ledger } from "./ledger";
import { MaybePromise } from "./utils";

export type VariableType = string | number;

interface BaseVariableDefinition<T> {
  name: string;
  label?: string;
  display?: "select" | "toggle";
  options: (params: VariablesParams) => MaybePromise<T[]>;
}

export type VariableDefinition<T = VariableType> = BaseVariableDefinition<T> &
  ({ multiple?: false; default?: T } | { multiple: true; default?: T[] });

export type VariablesParams = {
  ledger: Ledger;
  variables: VariablesContents;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariablesContents = Record<string, any>;
