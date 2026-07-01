/**
 * Copyright 2018–2020 Observable, Inc.
 * Copyright 2018 Mike Bostock
 * Copyright 2020 Fabian Iwand
 * Copyright 2022 Andreas Gerstmayr <andreas@gerstmayr.me>
 *
 * https://observablehq.com/@d3/sankey
 * https://gist.github.com/mootari/8d3eeb938fafbdf43cda77fe23642d00
 */
import { Box, useTheme } from "@mui/material";
import * as d3Base from "d3";
import * as d3Sankey from "d3-sankey";
import { SankeyExtraProperties, SankeyLink, SankeyNode } from "d3-sankey";
import { useEffect, useRef } from "react";
import { PanelProps } from "./registry";
const d3 = Object.assign(d3Base, d3Sankey);

interface SankeyNodeProperties {
  name: string;
  label?: string;
}

interface SankeyLinkProperties {
  uid?: string;
}

export type D3SankeyNode = SankeyNode<SankeyNodeProperties, SankeyLinkProperties>;
export type D3SankeyLink = SankeyLink<SankeyNodeProperties, SankeyLinkProperties>;

export interface SankeySpec {
  /** Horizontal node alignment strategy. Defaults to "left". */
  align?: "left" | "right" | "center" | "justify";

  /** Label font size in pixels. Defaults to 12. */
  fontSize?: number;

  /** Label text color. Defaults to white in dark mode and black otherwise. */
  fontColor?: string;

  /** Node border color. Defaults to white in dark mode and black otherwise. */
  nodeStrokeColor?: string;

  /** Link coloring mode: "none" uses linkColor, "path" uses a source-to-target gradient, and "input" uses the source node color. */
  edgeColor?: "none" | "path" | "input";

  /** Link stroke color used when edgeColor is "none". Defaults to "#aaaaaa". */
  linkColor?: string;

  /** Formats node and link values for labels and tooltips. */
  valueFormatter?: (value: number) => string;

  /** Click handler attached to node labels. */
  onClick?: (event: Event, d: SankeyNode<SankeyNodeProperties, SankeyLinkProperties>) => void;

  /** Nodes and links that define the Sankey graph. */
  data: {
    /** Graph nodes keyed by their name property. */
    nodes: D3SankeyNode[];

    /** Directed graph links between source and target nodes. */
    links: D3SankeyLink[];
  };
}

export function render_d3sankey(elem: HTMLElement, options: SankeySpec, isDarkMode: boolean) {
  const width = elem.clientWidth;
  const height = elem.clientHeight;
  const defaultTextColor = isDarkMode ? "#ffffff" : "#000000";

  const {
    data,
    align = "left",
    fontSize = 12,
    fontColor = defaultTextColor,
    nodeStrokeColor = defaultTextColor,
    edgeColor = "path",
    linkColor = "#aaaaaa",
    valueFormatter = String,
    onClick,
  } = options;

  const color = (() => {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (d: any) => color(d.category === undefined ? d.name : d.category);
  })();

  const sankey = (() => {
    const sankey = d3
      .sankey<SankeyNodeProperties, SankeyLinkProperties>()
      .nodeId((d) => d.name)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .nodeAlign((d3 as any)[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [width - 1, height - 5],
      ]);
    return ({ nodes, links }: SankeySpec["data"]) =>
      sankey({
        nodes: nodes.map((d) => Object.assign({}, d)),
        links: links.map((d) => Object.assign({}, d)),
      });
  })();

  const chart = (() => {
    const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

    const { nodes, links } = sankey(data);

    // node rectangle
    svg
      .append("g")
      .attr("stroke", nodeStrokeColor)
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", (d) => d.x0!)
      .attr("y", (d) => d.y0!)
      .attr("height", (d) => d.y1! - d.y0!)
      .attr("width", (d) => d.x1! - d.x0!)
      .attr("fill", color)
      .append("title")
      .text((d) => `${d.name}: ${valueFormatter(d.value ?? 0)}`);

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .join("g")
      .style("mix-blend-mode", isDarkMode ? "normal" : "multiply");

    if (edgeColor === "path") {
      const gradient = link
        .append("linearGradient")
        .attr("id", (d, i) => (d.uid = `link-${i}`))
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (d) => (d.source as SankeyExtraProperties).x1)
        .attr("x2", (d) => (d.target as SankeyExtraProperties).x0);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (d) => color(d.source));

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", (d) => color(d.target));
    }

    link
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", (d) =>
        edgeColor === "none"
          ? linkColor
          : edgeColor === "path"
            ? `url(#${d.uid})`
            : edgeColor === "input"
              ? color(d.source)
              : color(d.target),
      )
      .attr("stroke-width", (d) => Math.max(1, d.width!));

    link
      .append("title")
      .text(
        (d) =>
          `${(d.source as SankeyNodeProperties).name} → ${(d.target as SankeyNodeProperties).name}: ${valueFormatter(
            d.value,
          )}`,
      );

    // node
    const node = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", fontSize)
      .attr("fill", fontColor)
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
      .attr("y", (d) => (d.y1! + d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
      .text((d) => `${d.label ?? d.name} ${valueFormatter(d.value ?? 0)}`);
    if (onClick) {
      node.on("click", onClick);
    }

    return svg.node();
  })();

  elem.replaceChildren(chart!);
}

export function D3SankeyPanel({ spec }: PanelProps<SankeySpec>) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    render_d3sankey(ref.current, spec, theme.palette.mode === "dark");
  }, [spec, theme.palette.mode]);

  return <Box ref={ref} sx={{ height: "100%", "svg text": { fill: "inherit" } }}></Box>;
}
