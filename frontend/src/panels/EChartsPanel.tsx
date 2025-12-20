import { useTheme } from "@mui/material/styles";
import { dispose, ECElementEvent, ECharts, EChartsOption, init, registerTheme } from "echarts";
import { useEffect, useRef } from "react";
import { useComponentWidthOf } from "../components/hooks";
import { PanelProps } from "./registry";
export interface EChartsSpec extends EChartsOption {
  onClick?: (params: ECElementEvent) => void;
  onDblClick?: (params: ECElementEvent) => void;
  echartsTheme?: object | undefined;
}

export function EChartsPanel({ spec }: PanelProps<EChartsSpec>) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts>(null);
  const width = useComponentWidthOf(ref);

  useEffect(() => {
    if (chartRef.current) {
      dispose(chartRef.current);
    }

    let echartsThemeName = theme.palette.mode === "dark" ? "dark" : undefined;
    if (spec.echartsTheme !== undefined) {
      const echartsTheme = spec.echartsTheme;
      const themeNameForComponent = "customTheme";
      registerTheme(themeNameForComponent, echartsTheme);
      echartsThemeName = themeNameForComponent;
      delete spec.echartsTheme;
    }

    const chart = init(ref.current, echartsThemeName);

    if (spec.onClick) {
      chart.on("click", spec.onClick);
      delete spec.onClick;
    }

    if (spec.onDblClick) {
      chart.on("dblclick", spec.onDblClick);
      delete spec.onDblClick;
    }

    if (echartsThemeName == "dark" && spec.backgroundColor === undefined) {
      spec.backgroundColor = "transparent";
    }

    chart.setOption(spec);
    chartRef.current = chart;
  }, [ref, spec, theme.palette.mode]);

  useEffect(() => {
    if (chartRef.current && width != 0) {
      chartRef.current.resize();
    }
  }, [width]);

  return <div ref={ref} style={{ height: "100%" }}></div>;
}
