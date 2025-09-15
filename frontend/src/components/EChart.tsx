import { useTheme } from "@mui/material/styles";
import * as echarts from "echarts";
import { CSSProperties, useEffect, useRef } from "react";

interface EChartProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  option: echarts.EChartsCoreOption;
}

export function EChart({ width, height, option }: EChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts>(null);
  const theme = useTheme();
  const themeMode = theme.palette.mode;

  /// Get the width of the parent div to resize dynamically
  // const parentDivWidth = useComponentWidthOf(ref);

  useEffect(() => {
    if (chartRef.current) {
      echarts.dispose(chartRef.current);
    }

    const echartsTheme = themeMode === "dark" ? "dark" : undefined;
    const chart = echarts.init(ref.current, echartsTheme);
    if (option.onClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.on("click", (option as any).onClick);
      delete option.onClick;
    }

    if (themeMode == "dark" && option.backgroundColor === undefined) {
      option.backgroundColor = "transparent";
    }

    chart.setOption(option);
    chart.resize();
    chartRef.current = chart;
  }, [option, themeMode]);

  // Resize dynamically
  /*useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [parentDivWidth]);*/

  return <div ref={ref} style={{ width, height }}></div>;
}
