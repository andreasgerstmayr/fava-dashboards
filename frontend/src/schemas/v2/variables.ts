import { Ledger } from "./ledger";
import { MaybePromise } from "./utils";

export type VariableType = string;

interface VariableBase<T> {
  name: string;
  label?: string;
  display?: "select" | "toggle";
  options: (params: VariableOptionsParams) => MaybePromise<T[]>;
}

export type Variable<T = VariableType> = VariableBase<T> &
  ({ multiple?: false; default?: T } | { multiple: true; default?: T[] });

export type VariableOptionsParams = {
  ledger: Ledger;
  variables: ResolvedVariables;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolvedVariables = Record<string, any>;
export type StrictResolvedVariables = Record<string, VariableType | VariableType[] | undefined>;
