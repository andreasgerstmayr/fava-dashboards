export default {
  color: ["#e52c3c", "#f7b1ab", "#fa506c", "#f59288", "#f8c4d8", "#e54f5c", "#f06d5c", "#e54f80", "#f29c9f", "#eeb5b7"],
  title: {
    textStyle: {
      fontWeight: "normal",
      color: "#e52c3c",
    },
  },
  visualMap: {
    color: ["#e52c3c", "#f7b1ab"],
  },
  dataRange: {
    color: ["#e52c3c", "#f7b1ab"],
  },
  candlestick: {
    itemStyle: {
      color: "#e52c3c",
      color0: "#f59288",
    },
    lineStyle: {
      width: 1,
      color: "#e52c3c",
      color0: "#f59288",
    },
    areaStyle: {
      color: "#fa506c",
      color0: "#f8c4d8",
    },
  },
  map: {
    itemStyle: {
      color: "#e52c3c",
      borderColor: "#fff",
      borderWidth: 1,
    },
    areaStyle: {
      color: "#ccc",
    },
    label: {
      color: "rgba(139,69,19,1)",
      show: false,
    },
  },
  graph: {
    itemStyle: {
      color: "#f2385a",
    },
    nodeStyle: {
      brushType: "both",
      strokeColor: "#e54f5c",
    },
    linkStyle: {
      color: "#f2385a",
      strokeColor: "#e54f5c",
    },
    label: {
      color: "#f2385a",
      show: false,
    },
  },
  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.2, "#e52c3c"],
          [0.8, "#f7b1ab"],
          [1, "#fa506c"],
        ],
        width: 8,
      },
    },
  },
  series: [],
};
