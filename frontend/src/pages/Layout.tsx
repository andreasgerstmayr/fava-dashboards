import { Outlet } from "react-router";
import { QueryParamProvider } from "use-query-params";
import { ConfigProvider } from "../components/ConfigProvider";
import { Header } from "../components/Header";
import { ReactRouterAdapter } from "../components/ReactRouterAdapter";

export function Layout() {
  return (
    <QueryParamProvider adapter={ReactRouterAdapter}>
      <ConfigProvider>
        <Header />
        <Outlet />
      </ConfigProvider>
    </QueryParamProvider>
  );
}
