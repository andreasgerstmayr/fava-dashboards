import { Outlet } from "react-router";
import { QueryParamProvider } from "use-query-params";
import { Header } from "../components/Header";
import { ReactRouterAdapter } from "../components/ReactRouterAdapter";

export function Layout() {
  return (
    <QueryParamProvider adapter={ReactRouterAdapter}>
      <Header />
      <Outlet />
    </QueryParamProvider>
  );
}
