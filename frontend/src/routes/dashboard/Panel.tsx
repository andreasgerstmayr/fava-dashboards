import { Box, Card, Skeleton, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { urlFor } from "../../api/url";
import { useConfigContext } from "../../components/ConfigProvider";
import { ErrorAlert } from "../../components/ErrorAlert";
import { PanelProps, panelRegistry, PanelSpecOf } from "../../panels/registry";
import { Ledger } from "../../schemas/v2/ledger";
import { Dashboard, Panel } from "../../schemas/v2/schema";
import { StrictResolvedVariables } from "../../schemas/v2/variables";
import { useVariables, VariablesToolbar } from "./Variables";

interface PanelCardProps {
  ledger: Ledger;
  dashboard: Dashboard;
  panel: Panel;
}

export function PanelCard({ ledger, dashboard, panel }: PanelCardProps) {
  const { config } = useConfigContext();
  const variableDefinitions = [...(dashboard.variables ?? []), ...(panel.variables ?? [])];
  const resolvedVariables = useVariables(ledger, variableDefinitions);
  const renderedPanel = useRenderPanel(ledger, panel, resolvedVariables.data?.values);
  const isPending = resolvedVariables.isPending || renderedPanel.isPending;
  const error = resolvedVariables.error || renderedPanel.error;

  return (
    <Box
      sx={{
        padding: 1,
        minWidth: 400,
        "@media (max-width: 985px)": {
          minWidth: "100%",
        },
      }}
      style={{ width: panel.width }}
    >
      <Card variant="outlined" sx={{ padding: 2, ...config.theme?.dashboard?.panel?.style }}>
        <Stack sx={{ height: 40, flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
          <h3 className="title" style={{ marginBottom: 0 }}>
            {panel.link ? (
              <a
                href={urlFor(panel.link)}
                style={{
                  color: "inherit", // do no apply link styling
                }}
              >
                {panel.title}
              </a>
            ) : (
              panel.title
            )}
          </h3>
          {panel.variables && panel.variables.length > 0 && (
            <VariablesToolbar
              ledger={ledger}
              variables={variableDefinitions}
              startIndex={dashboard.variables?.length}
            />
          )}
        </Stack>
        <Box style={{ height: panel.height }}>
          {error ? (
            <ErrorAlert error={error} />
          ) : isPending ? (
            <Skeleton variant="rounded" sx={{ width: "100%", height: "100%" }} />
          ) : (
            <ErrorBoundary FallbackComponent={ErrorAlert}>{renderedPanel.data}</ErrorBoundary>
          )}
        </Box>
      </Card>
    </Box>
  );
}

function useRenderPanel(ledger: Ledger, panel: Panel, variables: StrictResolvedVariables | undefined) {
  return useQuery({
    enabled: !!variables,
    queryKey: ["useRenderPanel", ledger, panel, variables],
    queryFn: async () => {
      if (!variables) {
        return;
      }

      const specParams = { panel, ledger, variables };

      // React panel
      if (panel.kind === "react") {
        const PanelComponent = panel.spec;
        return <PanelComponent {...specParams} />;
      }

      // other panels from registry
      const PanelComponent = panelRegistry[panel.kind] as (
        props: PanelProps<PanelSpecOf<typeof panel.kind>>,
      ) => ReactElement;
      if (!PanelComponent) {
        return <span>Unknown panel kind {panel.kind}.</span>;
      }
      const spec = await Promise.resolve(panel.spec(specParams));
      return <PanelComponent spec={spec} />;
    },
    // this query returns a new object every time, which would trigger a re-render and new animation of the panel
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
