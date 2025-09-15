import { Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useConfigContext } from "../components/ConfigProvider";
import { D3Sankey } from "../components/D3Sankey";
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
  }, [name, navigate, dashboards]);

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

export function Panel({ panel }: PanelProps) {
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
        case "html": {
          const html = await Promise.resolve(panel.render({ panel, ledger }));
          return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
        }

        case "echarts": {
          const option = await Promise.resolve(panel.render({ panel, ledger }));
          return <EChart option={option} height={contentHeight} />;
        }

        case "d3_sankey": {
          const options = await Promise.resolve(panel.render({ panel, ledger }));
          return <D3Sankey options={options} height={contentHeight} />;
        }

        default:
          return <span>Unknown panel type {(panel as Panel).type}.</span>;
      }
    },
  });

  return (
    <div className="panel" style={{ width: panel.width ?? "100%", minWidth: 200, padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>
        {panel.link ? (
          <Link to={panel.link} style={{ color: "light-dark(#333, #d7dce2)" /* --heading-color from fava */ }}>
            {panel.title}
          </Link>
        ) : (
          panel.title
        )}
      </h2>
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
