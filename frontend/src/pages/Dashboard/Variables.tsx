import { Autocomplete, Checkbox, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import {
  ArrayParam,
  NumberParam,
  NumericArrayParam,
  QueryParamConfig,
  StringParam,
  useQueryParam,
  withDefault,
} from "use-query-params";
import { ErrorAlert } from "../../components/ErrorAlert";
import { Ledger } from "../../schemas/v2/ledger";
import { StrictResolvedVariables, Variable, VariableType } from "../../schemas/v2/variables";

interface VariablesToolbarProps {
  ledger: Ledger;
  variables: Variable[];
  startIndex?: number;
}

export function VariablesToolbar({ ledger, variables, startIndex = 0 }: VariablesToolbarProps) {
  return (
    <Stack sx={{ height: 40, flexDirection: "row", gap: 2 }}>
      {variables.map(
        (definition, i) =>
          i >= startIndex && (
            <VariableToolbar key={definition.name} ledger={ledger} variables={variables.slice(0, i + 1)} />
          ),
      )}
    </Stack>
  );
}

interface VariableToolbarProps {
  ledger: Ledger;
  variables: Variable[];
}

function VariableToolbar({ ledger, variables }: VariableToolbarProps) {
  const { isPending, error, data } = useVariables(ledger, variables);
  const variable = variables[variables.length - 1];

  const [value, setValue] = useQueryParam<VariableType | VariableType[]>(
    searchParamName(variable.name),
    data ? (getQueryParamType(variable, data.options) as QueryParamConfig<VariableType | VariableType[]>) : undefined,
  );

  if (isPending) {
    // same dimensions as <Autocomplete>
    return <Skeleton variant="rounded" sx={{ width: 120, height: 37 }} />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  const { options } = data;

  if (variable.display == "toggle") {
    return (
      <ToggleButtonGroup exclusive={!variable.multiple} value={value} onChange={(_event, value) => setValue(value)}>
        {options.map((option) => (
          <ToggleButton key={option} value={option}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  if (variable.multiple) {
    return (
      <Autocomplete
        size="small"
        disableClearable
        multiple
        disableCloseOnSelect
        options={options}
        value={value as VariableType[]}
        onChange={(_event, newValue: VariableType[]) => {
          setValue(newValue);
        }}
        renderOption={(props, option, { selected }) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={variable.label ?? variable.name} />}
        sx={{ width: 120 }}
      />
    );
  }

  return (
    <Autocomplete
      size="small"
      disableClearable
      options={options}
      value={value as VariableType}
      onChange={(_event, newValue: VariableType | null) => {
        setValue(newValue ?? variable.default ?? options[0]);
      }}
      renderInput={(params) => <TextField {...params} label={variable.label ?? variable.name} />}
      sx={{ width: 120 }}
    />
  );
}

function getQueryParamType(definition: Variable, options: VariableType[]) {
  if (definition.multiple) {
    switch (typeof options[0]) {
      case "string":
        return withDefault(ArrayParam, (definition.default as string[] | undefined) ?? []);
      case "number":
        return withDefault(NumericArrayParam, (definition.default as number[] | undefined) ?? []);
      default:
        throw Error(`Invalid option value: ${typeof options[0]}`);
    }
  }

  switch (typeof options[0]) {
    case "string":
      return withDefault(StringParam, (definition.default as string | undefined) ?? options[0]);
    case "number":
      return withDefault(NumberParam, (definition.default as number | undefined) ?? options[0]);
    default:
      throw Error(`Invalid option value: ${typeof options[0]}`);
  }
}

export function useVariables(ledger: Ledger, variables: Variable[]) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  return useQuery({
    // include only search params which are part of the definition chain
    queryKey: ["useVariables", variables, variables.map((d) => searchParams.get(searchParamName(d.name)))],
    queryFn: () => resolveVariables(queryClient, ledger, variables, searchParams),
    staleTime: Infinity,
  });
}

async function resolveVariables(
  queryClient: QueryClient,
  ledger: Ledger,
  variables: Variable[],
  searchParams: URLSearchParams,
) {
  const values: StrictResolvedVariables = {};
  let options: VariableType[] = [];

  // Iteratively call the options callback of every variable (starting with dashboard variables, then panel variables),
  // because every variable options callback depends on the resolved variable values of the previous variable.
  // All results are cached, mitigating the performance impact.
  for (const variable of variables) {
    options = await queryClient.fetchQuery({
      queryKey: ["resolveVariables", ledger, variable, JSON.stringify(values)],
      queryFn: async () => {
        return await Promise.resolve(variable.options({ ledger, variables: values }));
      },
      staleTime: Infinity,
    });

    const paramType = getQueryParamType(variable, options);
    const value = paramType.decode(searchParams.get(searchParamName(variable.name))) as VariableType | VariableType[];
    values[variable.name] = value;
  }

  if (variables.length === 0) {
    return { values, options, value: undefined };
  }

  const lastVariable = variables[variables.length - 1];
  return { values, options, value: values[lastVariable.name] };
}

function searchParamName(name: string) {
  return `var_${name}`;
}
