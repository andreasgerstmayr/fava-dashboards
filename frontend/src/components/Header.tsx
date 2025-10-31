import { Box } from "@mui/material";
import { NavLink } from "react-router";
import { slugify } from "../router";
import { useConfigContext } from "./ConfigProvider";

export function Header() {
  const {
    config: { dashboards },
  } = useConfigContext();

  return (
    <Box className="headerline" sx={{ ".active": { color: "light-dark(hsl(0deg 0% 25%), hsl(0deg 0% 80%))" } }}>
      {dashboards.map((dashboard, i) => (
        <h3 key={i}>
          <NavLink to={`/dashboards/${slugify(dashboard.name)}`}>{dashboard.name}</NavLink>
        </h3>
      ))}
    </Box>
  );
}
