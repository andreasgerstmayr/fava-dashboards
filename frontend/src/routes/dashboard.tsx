import { Skeleton, Stack, useTheme } from "@mui/material";
import { createRoute, Navigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { useLedgerData } from "../api/ledger";
import { query } from "../api/query";
import { urlFor } from "../api/url";
import { useConfigContext } from "../components/ConfigProvider";
import { ErrorAlert } from "../components/ErrorAlert";
import { slugify } from "../router";
import { Dashboard } from "../schemas/v2/schema";
import { retainSearchParams, RootRoute } from "./__root";
import { PanelCard } from "./dashboard/Panel";
import { VariablesToolbar } from "./dashboard/Variables";

const searchSchema = z.object({
  dashboard: z.string().optional(),
});

export const DashboardRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  validateSearch: searchSchema,
  component: DashboardPage,
});

function DashboardPage() {
  const {
    config: { dashboards },
  } = useConfigContext();
  const { dashboard: dashboardName } = DashboardRoute.useSearch();

  if (!dashboardName && dashboards.length > 0) {
    return (
      <Navigate
        to="."
        search={(prev) => ({ ...retainSearchParams(prev), dashboard: slugify(dashboards[0].name) })}
        replace
      />
    );
  }

  const dashboard = dashboards.find((d) => slugify(d.name) === dashboardName);
  if (!dashboard) {
    return <strong>Dashboard not found.</strong>;
  }

  return <DashboardGrid dashboard={dashboard} />;
}

interface DashboardGridProps {
  dashboard: Dashboard;
}

function DashboardGrid({ dashboard }: DashboardGridProps) {
  const theme = useTheme();
  const { isPending, error, data: ledgerData } = useLedgerData();
  const ledger = useMemo(() => {
    if (!ledgerData) {
      return;
    }
    return {
      ...ledgerData.ledgerData,
      query,
      urlFor,
    };
  }, [ledgerData]);

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      {dashboard.variables && dashboard.variables.length > 0 && ledger && (
        <VariablesToolbar ledger={ledger} variables={dashboard.variables} />
      )}
      <Stack
        sx={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          // remove 1.5em padding from <article>
          mx: "-1.5em",
          marginBottom: "-1.5em",
          // cannot use gap, because two 50% width panels would not fit anymore
          // in the border-box css model only border+padding counts towards width
          padding: "calc(1.5em - var(--mui-spacing))",
          backgroundColor: theme.palette.mode === "dark" ? undefined : "#FAFBFB",
        }}
      >
        {isPending || !ledger ? (
          <Skeleton width="100%" height={600} sx={{ margin: 1 }} />
        ) : (
          dashboard.panels.map((panel, i) => <PanelCard key={i} ledger={ledger} dashboard={dashboard} panel={panel} />)
        )}
      </Stack>
    </>
  );
}
