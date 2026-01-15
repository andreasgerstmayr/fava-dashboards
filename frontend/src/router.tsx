import { createHashRouter, Navigate } from "react-router";
import { DashboardPage } from "./pages/Dashboard/Dashboard";
import { Layout } from "./pages/Layout";

export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboards" replace /> },
      {
        path: "dashboards",
        children: [
          { index: true, element: <DashboardPage /> },
          { path: ":name", element: <DashboardPage /> },
        ],
      },
    ],
  },
]);

export function slugify(s: string) {
  return s
    .replaceAll(/[^a-zA-Z0-9]/g, "-")
    .replaceAll(/-{2,}/g, "_")
    .toLowerCase();
}
