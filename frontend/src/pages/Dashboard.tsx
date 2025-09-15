import { Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { query } from "../api/query";
import { useConfigContext } from "../components/ConfigProvider";
import { EChart } from "../components/EChart";
import { ErrorAlert } from "../components/ErrorAlert";
import { Panel } from "../model/dashboard";
import { slugify } from "../router";

export function Dashboard() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { dashboards } = useConfigContext();

  useEffect(() => {
    if (!name) {
      navigate(`/dashboards/${slugify(dashboards[0].name)}`, { replace: true });
    }
  }, [name]);

  const dashboard = dashboards.find((d) => slugify(d.name) === name);
  if (!dashboard) {
    return <strong>Dashboard not found.</strong>;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {dashboard.panels.map((panel, i) => (
        <Panel key={i} panel={panel} />
      ))}
    </Box>
  );
}

interface PanelProps {
  panel: Panel;
}

export function Panel(props: PanelProps) {
  const { panel } = props;
  const { ledger } = useConfigContext();
  const contentHeight = panel.height ?? 400;
  const {
    isPending,
    error,
    data: content,
  } = useQuery({
    queryKey: [panel],
    queryFn: async () => {
      switch (panel.type) {
        case "html":
          const html = await Promise.resolve(panel.render({ panel, ledger, query }));
          return <div dangerouslySetInnerHTML={{ __html: html }}></div>;

        case "echarts":
          const option = await Promise.resolve(panel.render({ panel, ledger, query }));
          return <EChart option={option} height={contentHeight} />;
      }
    },
  });

  return (
    <div style={{ width: panel.width ?? "100%", minWidth: 200, padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>{panel.link ? <Link to={panel.link}>{panel.title}</Link> : panel.title}</h2>
      <div style={{ height: contentHeight }}>
        {isPending ? (
          <Skeleton variant="rounded" sx={{ width: "100%", height: "100%" }} />
        ) : error ? (
          <ErrorAlert error={error} />
        ) : (
          content
        )}
      </div>
    </div>
  );
}
