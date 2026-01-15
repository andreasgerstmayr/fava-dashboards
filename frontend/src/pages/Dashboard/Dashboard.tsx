import { Stack, useTheme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { query } from "../../api/query";
import { urlFor } from "../../api/url";
import { useConfigContext } from "../../components/ConfigProvider";
import { slugify } from "../../router";
import { Ledger } from "../../schemas/v2/ledger";
import { Dashboard } from "../../schemas/v2/schema";
import { PanelCard } from "./Panel";
import { VariablesToolbar } from "./Variables";

export function DashboardPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const {
    config: { dashboards },
  } = useConfigContext();

  useEffect(() => {
    if (!name && dashboards.length > 0) {
      navigate(`/dashboards/${slugify(dashboards[0].name)}`, { replace: true });
    }
  }, [name, navigate, dashboards]);

  const dashboard = dashboards.find((d) => slugify(d.name) === name);

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
