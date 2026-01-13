import * as z from "zod";
import { panelKinds } from "../../panels/registry";

const ZEChartsTheme = z.union([z.record(z.string(), z.any()), z.string()]).optional();

const ZTheme = z
  .object({
    echarts: ZEChartsTheme,
    additionalCardStyle: z.any().optional(),
    additionalTitleStyle: z.record(z.string(), z.any()).optional(),
  })
  .default({});

const ZVariableDefinition = z.object({
  name: z.string(),
  label: z.string().optional(),
  display: z.enum(["select", "toggle"] as const).default("select"),
  style: z.looseObject({}).optional(),
  multiple: z.boolean().default(false),
  options: z.any(),
  default: z.any().optional(),
});

const ZBasePanel = z.object({
  title: z.string().optional(),
  width: z.string().default("100%"),
  height: z.string().default("400px"),
  link: z.string().optional(),
  variables: z.array(ZVariableDefinition).default([]),
});

const ZPanel = ZBasePanel.extend({
  kind: z.enum(panelKinds),
  spec: z.any(),
});

const ZDashboard = z.object({
  name: z.string(),
  variables: z.array(ZVariableDefinition).default([]),
  panels: z.array(ZPanel),
});

export const ZConfig = z.object({
  dashboards: z.array(ZDashboard),
  theme: ZTheme.optional().default({}),
});
