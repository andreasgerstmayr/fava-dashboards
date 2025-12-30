import { useTheme } from "@mui/material/styles";
import { dispose, ECElementEvent, ECharts, EChartsOption, init } from "echarts";
import { useEffect, useRef } from "react";
import { useConfigContext } from "../components/ConfigProvider";
import { useComponentWidthOf } from "../components/hooks";
import { CUSTOM_ECHARTS_THEME_NAME } from "../schemas/v2/dashboard";
import { PanelProps } from "./registry";
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
  const echartsTheme = config.theme?.echarts;

  useEffect(() => {
    if (chartRef.current) {
      dispose(chartRef.current);
    }

    const echartsThemeName = echartsTheme
      ? CUSTOM_ECHARTS_THEME_NAME
      : theme.palette.mode === "dark"
        ? "dark"
        : undefined;

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
  }, [ref, spec, theme.palette.mode, echartsTheme]);

  useEffect(() => {
    if (chartRef.current && width != 0) {
      chartRef.current.resize();
    }
  }, [width]);

  return <div ref={ref} style={{ height: "100%" }}></div>;
}
