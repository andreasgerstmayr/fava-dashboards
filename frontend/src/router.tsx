import { createHashRouter, Navigate } from "react-router";
import { Dashboard } from "./pages/Dashboard";
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
          { index: true, element: <Dashboard /> },
          { path: ":name", element: <Dashboard /> },
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
