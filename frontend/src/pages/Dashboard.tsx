import { Box, Card, Skeleton, Stack, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactElement, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { query } from "../api/query";
import { urlFor } from "../api/url";
import { useConfigContext } from "../components/ConfigProvider";
import { ErrorAlert } from "../components/ErrorAlert";
import { PanelProps, panelRegistry, PanelSpecOf } from "../panels/registry";
import { slugify } from "../router";
import { Ledger, Panel as TPanel } from "../schemas/v2";

export function Dashboard() {
  const theme = useTheme();
  const { name } = useParams();
  const navigate = useNavigate();
  const {
    config: { dashboards },
  } = useConfigContext();

  useEffect(() => {
    if (!name) {
      navigate(`/dashboards/${slugify(dashboards[0].name)}`, { replace: true });
    }
  }, [name, navigate, dashboards]);

  const dashboard = dashboards.find((d) => slugify(d.name) === name);
  if (!dashboard) {
    return <strong>Dashboard not found.</strong>;
  }

  return (
    <Stack
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        // remove 1.5em padding from <article>
        mx: "-1.5em",
        marginBottom: "-1.5em",
        padding: "calc(1.5em - var(--mui-spacing))",
        backgroundColor: theme.palette.mode === "dark" ? undefined : "#FAFBFB",
      }}
    >
      {dashboard.panels.map((panel, i) => (
        <PanelFrame key={i} panel={panel} />
      ))}
    </Stack>
  );
}

interface PanelFrameProps {
  panel: TPanel;
}

export function PanelFrame({ panel }: PanelFrameProps) {
  const theme = useTheme();
  const { ledgerData } = useConfigContext();

  const ledger: Ledger = useMemo(() => {
    return {
      ...ledgerData,
      query,
      urlFor,
    };
  }, [ledgerData]);

  const {
    isPending,
    error,
    data: content,
  } = useQuery({
    queryKey: [panel],
    queryFn: async () => {
      const ctx = { panel, ledger };

      // React panel
      if (panel.kind === "react") {
        const PanelComponent = panel.spec;
        return <PanelComponent {...ctx} />;
      }

      // other panels from registry
      const PanelComponent = panelRegistry[panel.kind] as (
        props: PanelProps<PanelSpecOf<typeof panel.kind>>,
      ) => ReactElement;
      if (!PanelComponent) {
        return <span>Unknown panel kind {panel.kind}.</span>;
      }
      const spec = await Promise.resolve(panel.spec(ctx));
      return <PanelComponent spec={spec} />;
    },
    // this query returns a new object every time, which would trigger a re-render and new animation of the panel
    refetchOnWindowFocus: false,
  });

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
      <Card variant="outlined" sx={{ padding: 2 }}>
        <h3 style={{ marginBottom: theme.spacing(1) }}>
          {panel.link ? (
            <Link to={panel.link} style={{ color: "light-dark(#333, #d7dce2)" /* --heading-color from Fava */ }}>
              {panel.title}
            </Link>
          ) : (
            panel.title
          )}
        </h3>
        <Box style={{ height: panel.height }}>
          {isPending ? (
            <Skeleton variant="rounded" sx={{ width: "100%", height: "100%" }} />
          ) : error ? (
            <ErrorAlert error={error} />
          ) : (
            content
          )}
        </Box>
      </Card>
    </Box>
  );
}
