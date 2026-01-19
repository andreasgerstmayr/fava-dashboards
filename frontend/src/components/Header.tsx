import { Box } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { slugify } from "../router";
import { retainSearchParams } from "../routes/__root";
import { useConfigContext } from "./ConfigProvider";

export function Header() {
  const {
    config: { dashboards },
  } = useConfigContext();

  return (
    <Box className="headerline" sx={{ ".active": { color: "inherit" } }}>
      {dashboards.map((dashboard, i) => (
        <h3 key={i}>
          <Link to="." search={(prev) => ({ ...retainSearchParams(prev), dashboard: slugify(dashboard.name) })}>
            {dashboard.name}
          </Link>
        </h3>
      ))}
    </Box>
  );
}
