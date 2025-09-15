import { Alert, Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useConfig } from "../api/config";
import { Dashboard, Ledger } from "../model/dashboard";

export interface ConfigContextType {
  ledger: Ledger;
  dashboards: Dashboard[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface DashboardsProviderProps {
  children?: React.ReactNode;
}

export function ConfigProvider(props: DashboardsProviderProps) {
  const { children } = props;
  const { isPending: isPendingConfig, error: errorConfig, data: config } = useConfig();
  const {
    isPending: isPendingEval,
    error: errorEval,
    data: dashboards,
  } = useQuery({
    queryKey: [config?.dashboardsJs],
    enabled: !!config?.dashboardsJs,
    queryFn: () => runAsyncFunction(config?.dashboardsJs ?? ""),
  });

  if (isPendingConfig || isPendingEval) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (errorConfig) {
    return <Alert severity="error">{errorConfig.message}</Alert>;
  }
  if (errorEval) {
    return <Alert severity="error">{errorEval.message}</Alert>;
  }

  return <ConfigContext.Provider value={{ ledger: config.ledger, dashboards }}>{children}</ConfigContext.Provider>;
}

export function useConfigContext(): ConfigContextType {
  const ctx = useContext(ConfigContext);
  if (ctx === undefined) {
    throw new Error("No ConfigContext found. Did you forget <ConfigProvider>?");
  }
  return ctx;
}

function runAsyncFunction(src: string, args: Record<string, any> = {}): Promise<any> {
  const AsyncFunction = async function () {}.constructor;
  const params = Object.entries(args);
  const fn = AsyncFunction(Array.from(params.keys()), src);
  return fn(...params.values());
}
