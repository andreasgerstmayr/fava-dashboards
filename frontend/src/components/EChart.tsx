import { useElementSize } from "@mantine/hooks";
import { useTheme } from "@mui/material/styles";
import * as echarts from "echarts";
import { CSSProperties, useEffect, useRef } from "react";

interface EChartProps {
  height: CSSProperties["height"];
  option: echarts.EChartsCoreOption;
}

export function EChart({ height, option }: EChartProps) {
  const { ref, width } = useElementSize();
  const chartRef = useRef<echarts.ECharts>(null);
  const theme = useTheme();
  const echartsTheme = theme.palette.mode === "dark" ? "dark" : undefined;

  useEffect(() => {
    if (chartRef.current) {
      echarts.dispose(chartRef.current);
    }

    const chart = echarts.init(ref.current, echartsTheme);

    if (option.onClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.on("click", (option as any).onClick);
      delete option.onClick;
    }

    if (option.onDblClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.on("dblclick", (option as any).onDblClick);
      delete option.onDblClick;
    }

    if (echartsTheme == "dark" && option.backgroundColor === undefined) {
      option.backgroundColor = "transparent";
    }

    chart.setOption(option);
    chartRef.current = chart;
  }, [ref, option, echartsTheme]);

  // Resize dynamically
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [width, height]);

  return <div ref={ref} style={{ height }}></div>;
}
