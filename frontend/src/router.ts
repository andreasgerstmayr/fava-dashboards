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
  // Grab the base url from the ledger data embedded in the page
  const baseUrl = JSON.parse(document.getElementById("ledger-data")?.textContent ?? "{}").base_url ?? "";
  const extension = "extension/FavaDashboards";
  return `${baseUrl}${extension}`;
}

export function slugify(s: string) {
  return s
    .replaceAll(/[^a-zA-Z0-9]/g, "-")
    .replaceAll(/-{2,}/g, "_")
    .toLowerCase();
}
