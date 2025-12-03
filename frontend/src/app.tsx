import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { ConfigProvider } from "./components/ConfigProvider";
import { FavaExtenstionContext } from "./extension";
import { router } from "./router";
import { CustomThemeProvider } from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderApp(container: Element, extensionContext: FavaExtenstionContext) {
  const root = createRoot(container);
  root.render(
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <ConfigProvider extensionContext={extensionContext}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </CustomThemeProvider>
    </QueryClientProvider>,
  );
}
