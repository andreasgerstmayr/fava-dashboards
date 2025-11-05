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
import { VariableDefinition, VariablesContents, VariableType } from "../../schemas/v2/variables";

interface VariablesToolbarProps {
  ledger: Ledger;
  definitions: VariableDefinition[];
  fromIdx?: number;
}

export function VariablesToolbar({ ledger, definitions, fromIdx }: VariablesToolbarProps) {
  return (
    <Stack sx={{ height: 40, flexDirection: "row", gap: 2 }}>
      {definitions.map((definition, i) =>
        i >= (fromIdx ?? 0) ? (
          <VariableToolbar key={definition.name} ledger={ledger} definitions={definitions.slice(0, i + 1)} />
        ) : null,
      )}
    </Stack>
  );
}

interface VariableToolbarProps {
  ledger: Ledger;
  definitions: VariableDefinition[];
}

function VariableToolbar({ ledger, definitions }: VariableToolbarProps) {
  const definition = definitions[definitions.length - 1];
  const { isPending, error, data } = useVariableDefinition(ledger, definitions);

  const [value, setValue] = useQueryParam<VariableType | VariableType[]>(
    searchParamName(definition.name),
    data ? (getQueryParamType(definition, data.options) as QueryParamConfig<VariableType | VariableType[]>) : undefined,
  );

  if (isPending) {
    // same dimensions as <Autocomplete>
    return <Skeleton variant="rounded" sx={{ width: 120, height: 37 }} />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  const { options } = data;

  if (definition.display == "toggle") {
    return (
      <ToggleButtonGroup exclusive={!definition.multiple} value={value} onChange={(_event, value) => setValue(value)}>
        {options.map((option) => (
          <ToggleButton key={option} value={option}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  if (definition.multiple) {
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
        renderInput={(params) => <TextField {...params} label={definition.label ?? definition.name} />}
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
        setValue(newValue ?? definition.default ?? options[0]);
      }}
      renderInput={(params) => <TextField {...params} label={definition.label ?? definition.name} />}
      sx={{ width: 120 }}
    />
  );
}

function getQueryParamType(definition: VariableDefinition, options: VariableType[]) {
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

export function useVariableDefinition(ledger: Ledger, definitions: VariableDefinition[]) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  return useQuery({
    // include only search params which are part of the definition chain
    queryKey: ["useVariableDefinition", definitions, definitions.map((d) => searchParams.get(searchParamName(d.name)))],
    queryFn: () => evaluateVariables(queryClient, ledger, definitions, searchParams),
    staleTime: Infinity,
  });
}

async function evaluateVariables(
  queryClient: QueryClient,
  ledger: Ledger,
  definitions: VariableDefinition[],
  searchParams: URLSearchParams,
) {
  const variables: VariablesContents = {};
  let options: VariableType[] = [];

  // Every variable callback depends on the result of the previous variable.
  // All results are cached, mitigating the performance impact.
  for (const definition of definitions) {
    options = await queryClient.fetchQuery({
      queryKey: ["evaluateVariables", ledger, definition, JSON.stringify(variables)],
      queryFn: async () => {
        return await Promise.resolve(definition.options({ ledger, variables }));
      },
      staleTime: Infinity,
    });

    const paramType = getQueryParamType(definition, options);
    const value = paramType.decode(searchParams.get(searchParamName(definition.name))) as VariableType | VariableType[];
    variables[definition.name] = value;
  }

  return { options, variables };
}

function searchParamName(name: string) {
  return `var_${name}`;
}
