import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, ReactNode, useContext } from "react";
import * as z from "zod";
import { useConfig } from "../api/config";
import { FavaExtenstionContext } from "../extension";
import * as api from "../index";
import { migrateV1ToV2 } from "../schemas/migrations";
import * as v1 from "../schemas/v1/v1";
import * as dashboardv2 from "../schemas/v2/dashboard";
import * as ledgerv2 from "../schemas/v2/ledger";
import * as zodv2 from "../schemas/v2/validation";
import { ErrorAlert } from "./ErrorAlert";
import { loadTSX, runAsyncFunction } from "./utils";

export interface ConfigContextType {
  ledgerData: ledgerv2.LedgerData;
  config: dashboardv2.Config;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  extensionContext: FavaExtenstionContext;
  children?: ReactNode;
}

export function ConfigProvider({ extensionContext, children }: ConfigProviderProps) {
  const { isPending: isPendingConfig, error: errorConfig, data: config } = useConfig();
  const {
    isPending: isPendingEval,
    error: errorEval,
    data: dynamicConfig,
  } = useQuery({
    queryKey: [config?.configJs, config?.utilsJs],
    enabled: !!config?.configJs,
    queryFn: async () => {
      if (!config?.configJs) {
        throw new Error("Config not loaded");
      }

      const dynamicConfig = loadTSX(config.configJs, dependencies);

      // load schema v1
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((dynamicConfig as any)?.dashboards?.[0]?.panels?.[0]?.type) {
        const result = v1.ZConfig.safeParse(dynamicConfig);
        if (!result.success) {
          throw new Error("Error validating configuration:\n\n" + z.prettifyError(result.error));
        }

        const utils = config.utilsJs ? ((await runAsyncFunction(config.utilsJs)) as v1.Utils) : {};
        return migrateV1ToV2(result.data, utils, extensionContext);
      }

      // by default, load schema v2
      const result = zodv2.ZConfig.safeParse(dynamicConfig);
      if (!result.success) {
        throw new Error("Error validating configuration:\n\n" + z.prettifyError(result.error));
      }
      return result.data;
    },
    // this query returns a new object every time, which would trigger a re-render
    refetchOnWindowFocus: false,
  });

  if (errorConfig) {
    return <ErrorAlert error={errorConfig} />;
  }
  if (errorEval) {
    return <ErrorAlert error={errorEval} />;
  }

  if (isPendingConfig || isPendingEval) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ConfigContext.Provider value={{ ledgerData: config.ledgerData, config: dynamicConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext(): ConfigContextType {
  const ctx = useContext(ConfigContext);
  if (ctx === undefined) {
    throw new Error("No ConfigContext found. Did you forget <ConfigProvider>?");
  }
  return ctx;
}

const dependencies: Record<string, unknown> = {
  "fava-dashboards": api,
  react: React,
};
