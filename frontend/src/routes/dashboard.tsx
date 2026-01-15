import { Stack, useTheme } from "@mui/material";
import { createRoute, Navigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { query } from "../api/query";
import { urlFor } from "../api/url";
import { useConfigContext } from "../components/ConfigProvider";
import { slugify } from "../router";
import { Ledger } from "../schemas/v2/ledger";
import { Dashboard } from "../schemas/v2/schema";
import { RootRoute } from "./__root";
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
    return <Navigate to="." search={{ dashboard: slugify(dashboards[0].name) }} replace />;
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
  const { ledgerData } = useConfigContext();
  const ledger: Ledger = useMemo(() => {
    return {
      ...ledgerData,
      query,
      urlFor,
    };
  }, [ledgerData]);

  return (
    <>
      {dashboard.variables && dashboard.variables.length > 0 && (
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
        {dashboard.panels.map((panel, i) => (
          <PanelCard key={i} ledger={ledger} dashboard={dashboard} panel={panel} />
        ))}
      </Stack>
    </>
  );
}
