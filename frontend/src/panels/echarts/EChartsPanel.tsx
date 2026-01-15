import { useTheme } from "@mui/material/styles";
import { dispose, ECElementEvent, ECharts, EChartsOption, init } from "echarts";
import { useEffect, useRef } from "react";
import { useConfigContext } from "../../components/ConfigProvider";
import { useComponentWidthOf } from "../../components/hooks";
import { PanelProps } from "../registry";
import * as themes from "./themes";

export type EChartsThemeName = keyof typeof themes;
export const EChartsThemeNames = Object.keys(themes) as ReadonlyArray<EChartsThemeName>;

export interface EChartsSpec extends EChartsOption {
  onClick?: (params: ECElementEvent) => void;
  onDblClick?: (params: ECElementEvent) => void;
}

export function EChartsPanel({ spec }: PanelProps<EChartsSpec>) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts>(null);
  const width = useComponentWidthOf(ref);
  const { config } = useConfigContext();
  const echartsTheme = loadTheme(config.theme?.echarts) ?? (theme.palette.mode === "dark" ? "dark" : undefined);

  useEffect(() => {
    if (chartRef.current) {
      dispose(chartRef.current);
    }

    const chart = init(ref.current, echartsTheme);

    if (spec.onClick) {
      chart.on("click", spec.onClick);
      delete spec.onClick;
    }

    if (spec.onDblClick) {
      chart.on("dblclick", spec.onDblClick);
      delete spec.onDblClick;
    }

    if (echartsTheme == "dark" && spec.backgroundColor === undefined) {
      spec.backgroundColor = "transparent";
    }

    chart.setOption(spec);
    chartRef.current = chart;
  }, [ref, spec, echartsTheme]);

  useEffect(() => {
    if (chartRef.current && width != 0) {
      chartRef.current.resize();
    }
  }, [width]);

  return <div ref={ref} style={{ height: "100%" }}></div>;
}

function loadTheme(theme: EChartsThemeName | object | undefined) {
  if (typeof theme === "string") {
    const resolved = themes[theme];
    if (!resolved) {
      throw Error(`Cannot find theme "${theme}". Available themes: ${Object.keys(themes).join(", ")}`);
    }
    return resolved;
  }
  return theme;
}
