import { createRouter } from "@tanstack/react-router";
import { RootRoute } from "./routes/__root";
import { DashboardRoute } from "./routes/dashboard";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const routeTree = RootRoute.addChildren([DashboardRoute]);

export const router = createRouter({
  routeTree,
  basepath: getExtensionPath(),
});

function getExtensionPath() {
  const path = location.pathname;
  const file = path.split("/")[1];
  return `/${file}/extension/FavaDashboards`;
}

export function slugify(s: string) {
  return s
    .replaceAll(/[^a-zA-Z0-9]/g, "-")
    .replaceAll(/-{2,}/g, "_")
    .toLowerCase();
}
