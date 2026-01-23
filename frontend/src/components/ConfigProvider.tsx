import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, ReactNode, useContext } from "react";
import * as z from "zod";
import { ConfigResponse, useConfig } from "../api/config";
import { FavaExtenstionContext } from "../extension";
import * as api from "../index";
import { migrateV1ToV2 } from "../schemas/v1/migrate";
import * as v1 from "../schemas/v1/v1";
import { Config, ConfigSchema } from "../schemas/v2/schema";
import { ErrorAlert } from "./ErrorAlert";
import { loadTSX, runAsyncFunction } from "./utils";

export interface ConfigContextType {
  config: Config;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  extensionContext: FavaExtenstionContext;
  children?: ReactNode;
}

export function ConfigProvider({ extensionContext, children }: ConfigProviderProps) {
  const config = useConfig();
  const dynamicConfig = useDynamicConfig(extensionContext, config.data);
  const isPending = config.isPending || dynamicConfig.isPending;
  const error = config.error || dynamicConfig.error;

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <ConfigContext.Provider value={{ config: dynamicConfig.data }}>{children}</ConfigContext.Provider>;
}

function useDynamicConfig(extensionContext: FavaExtenstionContext, config: ConfigResponse | undefined) {
  return useQuery({
    queryKey: [config?.configJs, config?.utilsJs],
    enabled: !!config?.configJs,
    queryFn: async () => {
      if (!config?.configJs) {
        throw new Error("Config not loaded");
      }

      let dynamicConfig = loadTSX(config.configJs, dependencies);

      // convert schema v1 to v2
      if (dynamicConfig?.dashboards?.[0]?.panels?.[0]?.type) {
        const result = v1.ConfigSchema.safeParse(dynamicConfig);
        if (!result.success) {
          throw new Error("Error validating v1 configuration:\n\n" + z.prettifyError(result.error));
        }

        const utils = config.utilsJs ? ((await runAsyncFunction(config.utilsJs)) as v1.Utils) : {};
        dynamicConfig = migrateV1ToV2(result.data, utils, extensionContext);
      }

      // load schema v2
      const result = ConfigSchema.safeParse(dynamicConfig);
      if (!result.success) {
        throw new Error("Error validating configuration:\n\n" + z.prettifyError(result.error));
      }
      return result.data;
    },
    // this query returns a new object every time, which would trigger a re-render
    refetchOnWindowFocus: false,
  });
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
