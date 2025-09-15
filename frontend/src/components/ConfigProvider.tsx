import { Alert, Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useConfig } from "../api/config";
import { FavaExtenstionContext } from "../extension";
import { Dashboard, Ledger } from "../model/dashboard";
import { migrate } from "../model/migrations";
import * as v1 from "../model/v1";
import { runAsyncFunction } from "./utils";

export interface ConfigContextType {
  ledger: Ledger;
  dashboards: Dashboard[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface DashboardsProviderProps {
  extensionContext: FavaExtenstionContext;
  children?: React.ReactNode;
}

export function ConfigProvider({ extensionContext, children }: DashboardsProviderProps) {
  const { isPending: isPendingConfig, error: errorConfig, data: config } = useConfig();
  const {
    isPending: isPendingEval,
    error: errorEval,
    data: dashboards,
  } = useQuery({
    queryKey: [config?.dashboardsJs, config?.utilsJs],
    enabled: !!config?.dashboardsJs,
    queryFn: async () => {
      const dashboards = (await runAsyncFunction(config?.dashboardsJs ?? "")) as Dashboard[];
      const utils = config?.utilsJs ? ((await runAsyncFunction(config?.utilsJs)) as v1.Utils) : {};
      return migrate(dashboards, utils, extensionContext);
    },
  });

  if (errorConfig) {
    return <Alert severity="error">{errorConfig.message}</Alert>;
  }
  if (errorEval) {
    return <Alert severity="error">{errorEval.message}</Alert>;
  }

  if (isPendingConfig || isPendingEval) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
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
