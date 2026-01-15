import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "../components/Header";

// https://github.com/beancount/fava/blob/b12a90c7645e702b0d398292bdddd90645e31a88/frontend/src/stores/url.ts#L41-L48
const retained_fava_search_params = ["account", "charts", "conversion", "filter", "interval", "time"];
const retained_search_params = [...retained_fava_search_params, "investments", "currency"];

// Workaround for broken retainSearchParams middleware
// https://github.com/TanStack/router/issues/5292
// https://github.com/TanStack/router/issues/2845
export function retainSearchParams(prev: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(prev).filter(([key]) => retained_search_params.includes(key)));
}

export const RootRoute = createRootRoute({
  component: Layout,
});

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
