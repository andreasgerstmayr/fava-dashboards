import { Autocomplete, Checkbox, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import * as z from "zod";
import { ErrorAlert } from "../../components/ErrorAlert";
import { Ledger } from "../../schemas/v2/ledger";
import { Variable } from "../../schemas/v2/schema";
import { StrictResolvedVariables, VariableType } from "../../schemas/v2/variables";

interface VariablesToolbarProps {
  ledger: Ledger;
  variables: Variable[];
  startIndex?: number;
}

export function VariablesToolbar({ ledger, variables, startIndex = 0 }: VariablesToolbarProps) {
  return (
    <Stack sx={{ height: 40, flexDirection: "row", gap: 2 }}>
      {variables.map(
        (variable, i) =>
          i >= startIndex && (
            <VariableToolbar key={variable.name} ledger={ledger} variables={variables.slice(0, i + 1)} />
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
  const navigate = useNavigate();
  const { isPending, error, data } = useVariables(ledger, variables);
  const variable = variables[variables.length - 1];

  if (isPending) {
    // same dimensions as <Autocomplete>
    return <Skeleton variant="rounded" sx={{ width: 120, height: 37, ...variable.style }} />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  const { value, options } = data;
  const setValue = (value: VariableType | VariableType[]) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        [getSearchParamName(variable.name)]: value,
      }),
      replace: true,
    });
  };

  if (variable.display == "toggle") {
    return (
      <ToggleButtonGroup
        exclusive={!variable.multiple}
        value={value}
        onChange={(_event, value) => setValue(value)}
        sx={{ ...variable.style }}
      >
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
        sx={{ width: 120, ...variable.style }}
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
      sx={{ width: 120, ...variable.style }}
    />
  );
}

export function useVariables(ledger: Ledger, variables: Variable[]) {
  const queryClient = useQueryClient();
  const searchParams: StrictResolvedVariables = useSearch({ strict: false });

  return useQuery({
    // include only search params which are part of the variables chain
    queryKey: ["useVariables", variables, variables.map((v) => searchParams[getSearchParamName(v.name)])],
    queryFn: () => resolveVariables(queryClient, ledger, variables, searchParams),
    staleTime: Infinity,
  });
}

async function resolveVariables(
  queryClient: QueryClient,
  ledger: Ledger,
  variables: Variable[],
  searchParams: StrictResolvedVariables,
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
        const optionsParams = { ledger, variables: values };
        return await Promise.resolve(variable.options(optionsParams));
      },
      staleTime: Infinity,
    });

    const searchParamName = getSearchParamName(variable.name);
    const value = searchParams[searchParamName];
    values[variable.name] = variable.multiple
      ? z
          .array(z.enum(options))
          .catch(variable.default ?? [options[0]])
          .parse(value)
      : z
          .enum(options)
          .catch(variable.default ?? options[0])
          .parse(value);
  }

  if (variables.length === 0) {
    return { values, options, value: undefined };
  }

  const lastVariable = variables[variables.length - 1];
  return { values, options, value: values[lastVariable.name] };
}

function getSearchParamName(name: string) {
  return `var_${name}`;
}
