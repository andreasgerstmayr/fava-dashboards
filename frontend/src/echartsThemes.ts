export type EChartsTheme = {
  backgroundColor?: unknown;
  title?: {
    textStyle?: {
      color?: unknown;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
export type EChartsThemes = Record<string, EChartsTheme>;

// see https://echarts.apache.org/en/download-theme.html
// and https://github.com/apache/echarts/tree/master/theme
export const echartsThemes = {
  alternativeDark: {
    // non-default dark theme
    color: [
      "#dd6b66",
      "#759aa0",
      "#e69d87",
      "#8dc1a9",
      "#ea7e53",
      "#eedd78",
      "#73a373",
      "#73b9bc",
      "#7289ab",
      "#91ca8c",
      "#f49f42",
    ],
    backgroundColor: "rgba(51,51,51,1)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#eeeeee",
      },
      subtextStyle: {
        color: "#aaa",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "circle",
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "circle",
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#fd1050",
        color0: "#0cf49b",
        borderColor: "#fd1050",
        borderColor0: "#0cf49b",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaa",
      },
      symbolSize: 4,
      symbol: "circle",
      smooth: false,
      color: [
        "#dd6b66",
        "#759aa0",
        "#e69d87",
        "#8dc1a9",
        "#ea7e53",
        "#eedd78",
        "#73a373",
        "#73b9bc",
        "#7289ab",
        "#91ca8c",
        "#f49f42",
      ],
      label: {
        color: "#eee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#eee",
        borderColor: "#444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#eee",
        borderColor: "#444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisLabel: {
        show: true,
        color: "#eeeeee",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#aaaaaa"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["#eeeeee"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisLabel: {
        show: true,
        color: "#eeeeee",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#aaaaaa"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["#eeeeee"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisLabel: {
        show: true,
        color: "#eeeeee",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#aaaaaa"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["#eeeeee"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisLabel: {
        show: true,
        color: "#eeeeee",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#aaaaaa"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["#eeeeee"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#999",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#666",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#eeeeee",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#eeeeee",
          width: "1",
        },
        crossStyle: {
          color: "#eeeeee",
          width: "1",
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#eeeeee",
        width: 1,
      },
      itemStyle: {
        color: "#dd6b66",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#eeeeee",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#e43c59",
        borderColor: "rgba(194,53,49, 0.5)",
      },
      label: {
        color: "#eeeeee",
      },
      emphasis: {
        itemStyle: {
          color: "#a9334c",
        },
        controlStyle: {
          color: "#eeeeee",
          borderColor: "#eeeeee",
          borderWidth: 0.5,
        },
        label: {
          color: "#eeeeee",
        },
      },
    },
    visualMap: {
      color: ["#bf444c", "#d88273", "#f6efa6"],
    },
    markPoint: {
      label: {
        color: "#eee",
      },
      emphasis: {
        label: {
          color: "#eee",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  v5Light: {
    color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
    backgroundColor: "rgba(0, 0, 0, 0)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#464646",
      },
      subtextStyle: {
        color: "#6E7079",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#eb5454",
        color0: "#47b262",
        borderColor: "#eb5454",
        borderColor0: "#47b262",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaa",
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
      color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
      label: {
        color: "#eee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#eee",
        borderColor: "#444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#eee",
        borderColor: "#444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisLabel: {
        show: true,
        color: "#6E7079",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#E0E6F1"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.2)", "rgba(210,219,238,0.2)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisLabel: {
        show: true,
        color: "#6E7079",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#E0E6F1"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.2)", "rgba(210,219,238,0.2)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisLabel: {
        show: true,
        color: "#6E7079",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#E0E6F1"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.2)", "rgba(210,219,238,0.2)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#6E7079",
        },
      },
      axisLabel: {
        show: true,
        color: "#6E7079",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#E0E6F1"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.2)", "rgba(210,219,238,0.2)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#999",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#666",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#333",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#ccc",
          width: 1,
        },
        crossStyle: {
          color: "#ccc",
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#DAE1F5",
        width: 2,
      },
      itemStyle: {
        color: "#A4B1D7",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#A4B1D7",
        borderColor: "#A4B1D7",
        borderWidth: 1,
      },
      checkpointStyle: {
        color: "#316bf3",
        borderColor: "#fff",
      },
      label: {
        color: "#A4B1D7",
      },
      emphasis: {
        itemStyle: {
          color: "#FFF",
        },
        controlStyle: {
          color: "#A4B1D7",
          borderColor: "#A4B1D7",
          borderWidth: 1,
        },
        label: {
          color: "#A4B1D7",
        },
      },
    },
    visualMap: {
      color: ["#bf444c", "#d88273", "#f6efa6"],
    },
    markPoint: {
      label: {
        color: "#eee",
      },
      emphasis: {
        label: {
          color: "#eee",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  vintage: {
    color: [
      "#d87c7c",
      "#919e8b",
      "#d7ab82",
      "#6e7074",
      "#61a0a8",
      "#efa18d",
      "#787464",
      "#cc7e63",
      "#724e58",
      "#4b565b",
    ],
    backgroundColor: "rgba(254,248,239,1)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#333333",
      },
      subtextStyle: {
        color: "#aaa",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#c23531",
        color0: "#314656",
        borderColor: "#c23531",
        borderColor0: "#314656",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaa",
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
      color: [
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
      ],
      label: {
        color: "#eee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#eeeeee",
        borderColor: "#444444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#eeeeee",
        borderColor: "#444444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#999999",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#666666",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#333333",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#cccccc",
          width: 1,
        },
        crossStyle: {
          color: "#cccccc",
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#293c55",
        width: 1,
      },
      itemStyle: {
        color: "#293c55",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#293c55",
        borderColor: "#293c55",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#e43c59",
        borderColor: "rgba(194,53,49,0.5)",
      },
      label: {
        color: "#293c55",
      },
      emphasis: {
        itemStyle: {
          color: "#a9334c",
        },
        controlStyle: {
          color: "#293c55",
          borderColor: "#293c55",
          borderWidth: 0.5,
        },
        label: {
          color: "#293c55",
        },
      },
    },
    visualMap: {
      color: ["#bf444c", "#d88273", "#f6efa6"],
    },
    markPoint: {
      label: {
        color: "#eee",
      },
      emphasis: {
        label: {
          color: "#eee",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  chalkDark: {
    color: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb", "#d2f5a6", "#76f2f2"],
    backgroundColor: "rgba(41,52,65,1)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#ffffff",
      },
      subtextStyle: {
        color: "#dddddd",
      },
    },
    line: {
      itemStyle: {
        borderWidth: "4",
      },
      lineStyle: {
        width: "3",
      },
      symbolSize: "0",
      symbol: "circle",
      smooth: true,
    },
    radar: {
      itemStyle: {
        borderWidth: "4",
      },
      lineStyle: {
        width: "3",
      },
      symbolSize: "0",
      symbol: "circle",
      smooth: true,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#fc97af",
        color0: "transparent",
        borderColor: "#fc97af",
        borderColor0: "#87f7cf",
        borderWidth: "2",
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: "1",
        color: "#ffffff",
      },
      symbolSize: "0",
      symbol: "circle",
      smooth: true,
      color: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb", "#d2f5a6", "#76f2f2"],
      label: {
        color: "#293441",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#f3f3f3",
        borderColor: "#999999",
        borderWidth: 0.5,
      },
      label: {
        color: "#893448",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,178,72,1)",
          borderColor: "#eb8146",
          borderWidth: 1,
        },
        label: {
          color: "rgb(137,52,72)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#f3f3f3",
        borderColor: "#999999",
        borderWidth: 0.5,
      },
      label: {
        color: "#893448",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,178,72,1)",
          borderColor: "#eb8146",
          borderWidth: 1,
        },
        label: {
          color: "rgb(137,52,72)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#666666",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#aaaaaa",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#e6e6e6"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#666666",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#aaaaaa",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#e6e6e6"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#666666",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#aaaaaa",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#e6e6e6"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#666666",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#aaaaaa",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#e6e6e6"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#999999",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#666666",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#999999",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#cccccc",
          width: 1,
        },
        crossStyle: {
          color: "#cccccc",
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#87f7cf",
        width: 1,
      },
      itemStyle: {
        color: "#87f7cf",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#87f7cf",
        borderColor: "#87f7cf",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#fc97af",
        borderColor: "rgba(252,151,175,0.3)",
      },
      label: {
        color: "#87f7cf",
      },
      emphasis: {
        itemStyle: {
          color: "#f7f494",
        },
        controlStyle: {
          color: "#87f7cf",
          borderColor: "#87f7cf",
          borderWidth: 0.5,
        },
        label: {
          color: "#87f7cf",
        },
      },
    },
    visualMap: {
      color: ["#fc97af", "#87f7cf"],
    },
    markPoint: {
      label: {
        color: "#293441",
      },
      emphasis: {
        label: {
          color: "#293441",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  infographicLight: {
    color: [
      "#c1232b",
      "#27727b",
      "#fcce10",
      "#e87c25",
      "#b5c334",
      "#fe8463",
      "#9bca63",
      "#fad860",
      "#f3a43b",
      "#60c0dd",
      "#d7504b",
      "#c6e579",
      "#f4e001",
      "#f0805a",
      "#26c0c0",
    ],
    backgroundColor: "rgba(255,255,255,100)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#27727b",
      },
      subtextStyle: {
        color: "#aaa",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: "3",
      },
      symbolSize: "5",
      symbol: "emptyCircle",
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: "3",
      },
      symbolSize: "5",
      symbol: "emptyCircle",
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#c1232b",
        color0: "#b5c334",
        borderColor: "#c1232b",
        borderColor0: "#b5c334",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaa",
      },
      symbolSize: "5",
      symbol: "emptyCircle",
      smooth: false,
      color: [
        "#c1232b",
        "#27727b",
        "#fcce10",
        "#e87c25",
        "#b5c334",
        "#fe8463",
        "#9bca63",
        "#fad860",
        "#f3a43b",
        "#60c0dd",
        "#d7504b",
        "#c6e579",
        "#f4e001",
        "#f0805a",
        "#26c0c0",
      ],
      label: {
        color: "#eee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#dddddd",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      label: {
        color: "#c1232b",
      },
      emphasis: {
        itemStyle: {
          areaColor: "#fe994e",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#dddddd",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      label: {
        color: "#c1232b",
      },
      emphasis: {
        itemStyle: {
          areaColor: "#fe994e",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#27727b",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#27727b",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#27727b",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#27727b",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#c1232b",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#e87c25",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#333333",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#27727b",
          width: 1,
        },
        crossStyle: {
          color: "#27727b",
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#293c55",
        width: 1,
      },
      itemStyle: {
        color: "#27727b",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#27727b",
        borderColor: "#27727b",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#c1232b",
        borderColor: "rgba(194,53,49, 0.5)",
      },
      label: {
        color: "#293c55",
      },
      emphasis: {
        itemStyle: {
          color: "#72d4e0",
        },
        controlStyle: {
          color: "#27727b",
          borderColor: "#27727b",
          borderWidth: 0.5,
        },
        label: {
          color: "#293c55",
        },
      },
    },
    visualMap: {
      color: ["#c1232b", "#fcce10"],
    },
    markPoint: {
      label: {
        color: "#eee",
      },
      emphasis: {
        label: {
          color: "#eee",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  romaLight: {
    color: [
      "#e01f54",
      "#001852",
      "#f5e8c8",
      "#b8d2c7",
      "#c6b38e",
      "#a4d8c2",
      "#f3d999",
      "#d3758f",
      "#dcc392",
      "#2e4783",
      "#82b6e9",
      "#ff6347",
      "#a092f1",
      "#0a915d",
      "#eaf889",
      "#6699FF",
      "#ff6666",
      "#3cb371",
      "#d5b158",
      "#38b6b6",
    ],
    backgroundColor: "rgba(255,255,255,100)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#333333",
      },
      subtextStyle: {
        color: "#aaa",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#e01f54",
        color0: "#001852",
        borderColor: "#f5e8c8",
        borderColor0: "#b8d2c7",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaa",
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
      color: [
        "#e01f54",
        "#001852",
        "#f5e8c8",
        "#b8d2c7",
        "#c6b38e",
        "#a4d8c2",
        "#f3d999",
        "#d3758f",
        "#dcc392",
        "#2e4783",
        "#82b6e9",
        "#ff6347",
        "#a092f1",
        "#0a915d",
        "#eaf889",
        "#6699FF",
        "#ff6666",
        "#3cb371",
        "#d5b158",
        "#38b6b6",
      ],
      label: {
        color: "#eee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#eeeeee",
        borderColor: "#444444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#eeeeee",
        borderColor: "#444444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#999999",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#666666",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#333333",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#cccccc",
          width: 1,
        },
        crossStyle: {
          color: "#cccccc",
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#293c55",
        width: 1,
      },
      itemStyle: {
        color: "#293c55",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#293c55",
        borderColor: "#293c55",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#e43c59",
        borderColor: "rgba(194,53,49,0.5)",
      },
      label: {
        color: "#293c55",
      },
      emphasis: {
        itemStyle: {
          color: "#a9334c",
        },
        controlStyle: {
          color: "#293c55",
          borderColor: "#293c55",
          borderWidth: 0.5,
        },
        label: {
          color: "#293c55",
        },
      },
    },
    visualMap: {
      color: ["#e01f54", "#e7dbc3"],
    },
    markPoint: {
      label: {
        color: "#eee",
      },
      emphasis: {
        label: {
          color: "#eee",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  macaronsLight: {
    color: [
      "#2ec7c9",
      "#b6a2de",
      "#5ab1ef",
      "#ffb980",
      "#d87a80",
      "#8d98b3",
      "#e5cf0d",
      "#97b552",
      "#95706d",
      "#dc69aa",
      "#07a2a4",
      "#9a7fd1",
      "#588dd5",
      "#f5994e",
      "#c05050",
      "#59678c",
      "#c9ab00",
      "#7eb00a",
      "#6f5553",
      "#c14089",
    ],
    backgroundColor: "rgba(255,255,255,100)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#008acd",
      },
      subtextStyle: {
        color: "#aaa",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 3,
      symbol: "emptyCircle",
      smooth: true,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 3,
      symbol: "emptyCircle",
      smooth: true,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#d87a80",
        color0: "#2ec7c9",
        borderColor: "#d87a80",
        borderColor0: "#2ec7c9",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaa",
      },
      symbolSize: 3,
      symbol: "emptyCircle",
      smooth: true,
      color: [
        "#2ec7c9",
        "#b6a2de",
        "#5ab1ef",
        "#ffb980",
        "#d87a80",
        "#8d98b3",
        "#e5cf0d",
        "#97b552",
        "#95706d",
        "#dc69aa",
        "#07a2a4",
        "#9a7fd1",
        "#588dd5",
        "#f5994e",
        "#c05050",
        "#59678c",
        "#c9ab00",
        "#7eb00a",
        "#6f5553",
        "#c14089",
      ],
      label: {
        color: "#eee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#dddddd",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      label: {
        color: "#d87a80",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(254,153,78,1)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#dddddd",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      label: {
        color: "#d87a80",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(254,153,78,1)",
          borderColor: "#444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#008acd",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#eee"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#008acd",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#eee"],
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#008acd",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#eee"],
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#008acd",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#eee"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#2ec7c9",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#18a4a6",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#333333",
      },
      left: "center",
      right: "auto",
      top: 0,
      bottom: 10,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#008acd",
          width: "1",
        },
        crossStyle: {
          color: "#008acd",
          width: "1",
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#008acd",
        width: 1,
      },
      itemStyle: {
        color: "#008acd",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#008acd",
        borderColor: "#008acd",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#2ec7c9",
        borderColor: "rgba(46,199,201,0.4)",
      },
      label: {
        color: "#008acd",
      },
      emphasis: {
        itemStyle: {
          color: "#a9334c",
        },
        controlStyle: {
          color: "#008acd",
          borderColor: "#008acd",
          borderWidth: 0.5,
        },
        label: {
          color: "#008acd",
        },
      },
    },
    visualMap: {
      color: ["#5ab1ef", "#e0ffff"],
    },
    markPoint: {
      label: {
        color: "#eee",
      },
      emphasis: {
        label: {
          color: "#eee",
        },
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      top: 60,
      bottom: 70,
    },
  },
  v5ishDark: {
    color: ["#4992ff", "#7cffb2", "#fddd60", "#ff6e76", "#58d9f9", "#05c091", "#ff8a45", "#8d48e3", "#dd79ff"],
    backgroundColor: "rgba(0, 0, 0, 100)",
    graph: {
      label: {
        color: "#eee",
      },
    },
    axisPointer: {
      lineStyle: {
        color: "#817f91",
      },
      crossStyle: {
        color: "#817f91",
      },
      label: {
        color: "#fff",
      },
    },
    legend: {
      textStyle: {
        color: "#B9B8CE",
      },
    },
    textStyle: {
      color: "#B9B8CE",
    },
    title: {
      textStyle: {
        color: "#EEF1FA",
      },
      subtextStyle: {
        color: "#B9B8CE",
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#B9B8CE",
      },
    },
    dataZoom: {
      borderColor: "#71708A",
      textStyle: {
        color: "#B9B8CE",
      },
      brushStyle: {
        color: "rgba(135,163,206,0.3)",
      },
      handleStyle: {
        color: "#353450",
        borderColor: "#C5CBE3",
      },
      moveHandleStyle: {
        color: "#B0B6C3",
        opacity: 0.3,
      },
      fillerColor: "rgba(135,163,206,0.2)",
      emphasis: {
        handleStyle: {
          borderColor: "#91B7F2",
          color: "#4D587D",
        },
        moveHandleStyle: {
          color: "#636D9A",
          opacity: 0.7,
        },
      },
      dataBackground: {
        lineStyle: {
          color: "#71708A",
          width: 1,
        },
        areaStyle: {
          color: "#71708A",
        },
      },
      selectedDataBackground: {
        lineStyle: {
          color: "#87A3CE",
        },
        areaStyle: {
          color: "#87A3CE",
        },
      },
    },
    visualMap: {
      textStyle: {
        color: "#B9B8CE",
      },
    },
    timeline: {
      lineStyle: {
        color: "#B9B8CE",
      },
      label: {
        color: "#B9B8CE",
      },
      controlStyle: {
        color: "#B9B8CE",
        borderColor: "#B9B8CE",
      },
    },
    calendar: {
      itemStyle: {
        color: "#100C2A",
      },
      dayLabel: {
        color: "#B9B8CE",
      },
      monthLabel: {
        color: "#B9B8CE",
      },
      yearLabel: {
        color: "#B9B8CE",
      },
    },
    timeAxis: {
      axisLine: {
        lineStyle: {
          color: "#B9B8CE",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#484753",
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"],
        },
      },
      minorSplitLine: {
        lineStyle: {
          color: "#20203B",
        },
      },
    },
    logAxis: {
      axisLine: {
        lineStyle: {
          color: "#B9B8CE",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#484753",
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"],
        },
      },
      minorSplitLine: {
        lineStyle: {
          color: "#20203B",
        },
      },
    },
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: "#B9B8CE",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#484753",
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"],
        },
      },
      minorSplitLine: {
        lineStyle: {
          color: "#20203B",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: "#B9B8CE",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#484753",
        },
        show: false,
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"],
        },
      },
      minorSplitLine: {
        lineStyle: {
          color: "#20203B",
        },
      },
    },
    line: {
      symbol: "circle",
    },
    gauge: {
      title: {
        color: "#B9B8CE",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#FD1050",
        color0: "#0CF49B",
        borderColor: "#FD1050",
        borderColor0: "#0CF49B",
      },
    },
  },
} satisfies EChartsThemes;

export type EChartsThemeName = keyof typeof echartsThemes;
