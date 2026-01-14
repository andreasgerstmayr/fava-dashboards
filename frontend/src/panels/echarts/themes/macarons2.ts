export default {
  color: [
    "#ed9678",
    "#e7dac9",
    "#cb8e85",
    "#f3f39d",
    "#c8e49c",
    "#f16d7a",
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
  title: {
    textStyle: {
      fontWeight: "normal",
      color: "#cb8e85",
    },
  },
  dataRange: {
    color: ["#cb8e85", "#e7dac9"],
    textStyle: {
      color: "#333",
    },
  },
  bar: {
    barMinHeight: 0,
    barGap: "30%",
    barCategoryGap: "20%",
    label: {
      show: false,
    },
    itemStyle: {
      barBorderColor: "#fff",
      barBorderRadius: 0,
      barBorderWidth: 1,
    },
    emphasis: {
      itemStyle: {
        barBorderColor: "rgba(0,0,0,0)",
        barBorderRadius: 0,
        barBorderWidth: 1,
      },
      label: {
        show: false,
      },
    },
  },
  line: {
    label: {
      show: false,
    },
    itemStyle: {},
    emphasis: {
      label: {
        show: false,
      },
    },
    lineStyle: {
      width: 2,
      type: "solid",
      shadowColor: "rgba(0,0,0,0)",
      shadowBlur: 5,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
    },
    symbolSize: 2,
    showAllSymbol: false,
  },
  candlestick: {
    itemStyle: {
      color: "#fe9778",
      color0: "#e7dac9",
    },
    lineStyle: {
      width: 1,
      color: "#f78766",
      color0: "#f1ccb8",
    },
    areaStyle: {
      color: "#e7dac9",
      color0: "#c8e49c",
    },
  },
  pie: {
    center: ["50%", "50%"],
    radius: [0, "75%"],
    clockWise: false,
    startAngle: 90,
    minAngle: 0,
    selectedOffset: 10,
    label: {
      show: true,
      position: "outer",
      color: "#1b1b1b",
      lineStyle: {
        color: "#1b1b1b",
      },
    },
    itemStyle: {
      borderColor: "#fff",
      borderWidth: 1,
    },
    labelLine: {
      show: true,
      length: 20,
      lineStyle: {
        width: 1,
        type: "solid",
      },
    },
  },
  map: {
    itemStyle: {
      color: "#ddd",
      borderColor: "#fff",
      borderWidth: 1,
    },
    areaStyle: {
      color: "#f3f39d",
    },
    label: {
      show: false,
      color: "rgba(139,69,19,1)",
    },
    showLegendSymbol: true,
  },
  graph: {
    itemStyle: {
      color: "#d87a80",
    },
    linkStyle: {
      strokeColor: "#a17e6e",
    },
    nodeStyle: {
      brushType: "both",
      strokeColor: "#a17e6e",
    },
    label: {
      show: false,
    },
  },
  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.2, "#ed9678"],
          [0.8, "#e7dac9"],
          [1, "#cb8e85"],
        ],
        width: 8,
      },
    },
  },
  series: [],
  visualMap: {
    color: ["#cb8e85", "#e7dac9"],
    textStyle: {
      color: "#333",
    },
  },
};
