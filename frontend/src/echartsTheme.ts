import { registerTheme } from "echarts";
import { EChartsTheme } from "./echartsThemes";

let isCustomThemeRegistered = false;

export const CUSTOM_ECHARTS_THEME_NAME = "customTheme" as const;

export function registerCustomTheme(theme: EChartsTheme) {
  if (isCustomThemeRegistered) {
    return;
  }
  registerTheme(CUSTOM_ECHARTS_THEME_NAME, theme as Record<string, unknown>);
  isCustomThemeRegistered = true;
}
