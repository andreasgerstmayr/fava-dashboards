import { Box } from "@mui/material";
import { NavLink } from "react-router";
import { slugify } from "../router";
import { useConfigContext } from "./ConfigProvider";

export function Header() {
  const { dashboards } = useConfigContext();

  return (
    <Box className="headerline" sx={{ "& .active": { color: "light-dark(#333, var(--mui-palette-text-primary))" } }}>
      {dashboards.map((dashboard, i) => (
        <h3 key={i}>
          <NavLink to={`/dashboards/${slugify(dashboard.name)}`}>{dashboard.name}</NavLink>
        </h3>
      ))}
    </Box>
  );
}
