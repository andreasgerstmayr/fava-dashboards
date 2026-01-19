import { useTheme } from "@mui/material/styles";
import { dispose, ECElementEvent, ECharts, EChartsOption, init } from "echarts";
import { useEffect, useRef } from "react";
import { useConfigContext } from "../../components/ConfigProvider";
import { useResizeObserver } from "../../components/hooks";
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
  const rect = useResizeObserver(ref);
  const { config } = useConfigContext();
  const echartsTheme = loadTheme(config.theme?.echarts) ?? (theme.palette.mode === "dark" ? "dark" : undefined);

  function cleanup() {
    if (chartRef.current) {
      dispose(chartRef.current);
      chartRef.current = null;
    }
  }

  useEffect(() => {
    cleanup();
    if (!rect) {
      return;
    }

    const chart = init(ref.current, echartsTheme, {
      width: rect.width,
      height: rect.height,
    });
    const { onClick, onDblClick, ...option } = spec;

    if (onClick) {
      chart.on("click", onClick);
    }

    if (onDblClick) {
      chart.on("dblclick", onDblClick);
    }

    if (echartsTheme == "dark" && option.backgroundColor === undefined) {
      option.backgroundColor = "transparent";
    }

    chart.setOption(option);
    chartRef.current = chart;

    return cleanup;
  }, [spec, echartsTheme, rect]);

  useEffect(() => {
    if (chartRef.current && rect) {
      chartRef.current.resize({ width: rect.width, height: rect.height });
    }
  }, [rect]);

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
