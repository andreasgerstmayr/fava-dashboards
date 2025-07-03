/**
 * Copyright 2018–2020 Observable, Inc.
 * Copyright 2018 Mike Bostock
 * Copyright 2020 Fabian Iwand
 * Copyright 2022 Andreas Gerstmayr <andreas@gerstmayr.me>
 *
 * https://observablehq.com/@d3/sankey
 * https://gist.github.com/mootari/8d3eeb938fafbdf43cda77fe23642d00
 */
import * as d3Base from "d3";
import * as d3Sankey from "d3-sankey";
import { SankeyExtraProperties, SankeyNode } from "d3-sankey";
const d3 = Object.assign(d3Base, d3Sankey);

interface SankeyNodeProperties {
  name: string;
}
interface SankeyLinkProperties {
  uid?: string;
}

interface SankeyOptions {
  align?: "left" | "right" | "center" | "justify";
  fontSize?: number;
  edgeColor?: "none" | "path" | "input";
  valueFormatter?: (value: number) => string;
  onClick?: (event: Event, d: SankeyNode<SankeyNodeProperties, SankeyLinkProperties>) => void;
  data: {
    nodes: SankeyNode<SankeyNodeProperties, SankeyLinkProperties>[];
    links: SankeyNode<SankeyNodeProperties, SankeyLinkProperties>[];
  };
}

export function render_d3sankey(elem: HTMLElement, options: SankeyOptions) {
  const width = elem.clientWidth;
  const height = elem.clientHeight;

  const data = options.data;
  const align = options.align ?? "left";
  const fontSize = options.fontSize ?? 12;
  const edgeColor = options.edgeColor ?? "path";
  const valueFormat = options.valueFormatter ?? ((x) => x);

  const color = (() => {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return (d) => color(d.category === undefined ? d.name : d.category);
  })();

  const sankey = (() => {
    const sankey = d3
      .sankey<SankeyNodeProperties, SankeyLinkProperties>()
      .nodeId((d) => d.name)
      .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [width - 1, height - 5],
      ]);
    return ({ nodes, links }) =>
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
      .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", (d) => d.x0!)
      .attr("y", (d) => d.y0!)
      .attr("height", (d) => d.y1! - d.y0!)
      .attr("width", (d) => d.x1! - d.x0!)
      .attr("fill", color)
      .append("title")
      .text((d) => `${d.name}: ${valueFormat(d.value)}`);

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .join("g")
      .style("mix-blend-mode", "multiply");

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
          ? "#aaa"
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
          `${(d.source as SankeyNodeProperties).name} → ${(d.target as SankeyNodeProperties).name}: ${valueFormat(
            d.value,
          )}`,
      );

    // node
    const node = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", fontSize)
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
      .attr("y", (d) => (d.y1! + d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
      .text((d) => `${d.name} ${valueFormat(d.value)}`);
    if (options.onClick) {
      node.on("click", options.onClick);
    }

    return svg.node();
  })();

  elem.replaceChildren(chart);
}
