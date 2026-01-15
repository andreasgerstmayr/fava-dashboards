import * as z from "zod";
import { EChartsThemeNames } from "../../panels/echarts/EChartsPanel";
import { panelKinds } from "../../panels/registry";

const ThemePanelSchema = z.object({
  style: z.looseObject({}).optional(),
});

const ThemeDashboardSchema = z.object({
  panel: ThemePanelSchema.optional(),
});

const ThemeSchema = z.object({
  echarts: z.union([z.enum(EChartsThemeNames), z.looseObject({})]).optional(),
  dashboard: ThemeDashboardSchema.optional(),
});

const VariableSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  display: z.enum(["select", "toggle"] as const).default("select"),
  style: z.looseObject({}).optional(),
  multiple: z.boolean().default(false),
  options: z.any(),
  default: z.any().optional(),
});
export type Variable = z.output<typeof VariableSchema>;

const BasePanelSchema = z.object({
  title: z.string().optional(),
  width: z.string().default("100%"),
  height: z.string().default("400px"),
  link: z.string().optional(),
  variables: z.array(VariableSchema).default([]),
});

const PanelSchema = BasePanelSchema.extend({
  kind: z.enum(panelKinds),
  spec: z.any(),
});
export type Panel = z.output<typeof PanelSchema>;

const DashboardSchema = z.object({
  name: z.string(),
  variables: z.array(VariableSchema).default([]),
  panels: z.array(PanelSchema),
});
export type Dashboard = z.output<typeof DashboardSchema>;

export const ConfigSchema = z.object({
  theme: ThemeSchema.optional(),
  dashboards: z.array(DashboardSchema),
});
export type Config = z.output<typeof ConfigSchema>;
