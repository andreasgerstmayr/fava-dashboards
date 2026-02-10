import { SxProps } from "@mui/material";
import { Ledger } from "./ledger";
import { MaybePromise } from "./utils";

export type VariableType = string;

interface VariableBaseInput<T> {
  name: string;
  label?: string;
  display?: "select" | "toggle";
  style?: SxProps;
  options: (params: VariableOptionsParams) => MaybePromise<T[]>;
}

export type VariableInput<T = VariableType> = VariableBaseInput<T> &
  ({ multiple?: false; default?: T } | { multiple: true; default?: T[] });

export type VariableOptionsParams = {
  ledger: Ledger;
  variables: ResolvedVariables;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolvedVariables = Record<string, any>;
export type StrictResolvedVariables = Record<string, VariableType | VariableType[] | undefined>;
