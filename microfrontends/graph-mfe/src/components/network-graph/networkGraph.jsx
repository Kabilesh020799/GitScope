import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import "./style.scss";

const drag = (simulation) => {
  const dragstarted = (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const showTooltip = (tooltip, event, d) => {
  tooltip
    .style("visibility", "visible")
    .html(
      `
      <div style="padding: 8px 12px; color: #fff;">
        <strong>${d.id}</strong><br/>
        PRs Authored: ${d.prsAuthored}<br/>
        PRs Reviewed: ${d.prsReviewed}
      </div>
    `
    )
    .style("top", `${event.pageY - 10}px`)
    .style("left", `${event.pageX + 10}px`);
};

const fitGraphToView = (svg, container, width, height, zoomHandler) => {
  const bounds = container.node().getBBox();
  const scale = 0.85 / Math.max(bounds.width / width, bounds.height / height);
  const translate = [
    width / 2 - scale * (bounds.x + bounds.width / 2),
    height / 2 - scale * (bounds.y + bounds.height / 2),
  ];

  svg
    .transition()
    .duration(750)
    .call(
      zoomHandler.transform,
      d3.zoomIdentity.translate(...translate).scale(scale)
    );
};

// Build graph nodes and links
const buildGraph = (pullRequests) => {
  const nodeMap = new Map();
  const linkMap = new Map();

  pullRequests.forEach((pr) => {
    const author = pr.user.login;
    if (!nodeMap.has(author)) {
      nodeMap.set(author, {
        id: author,
        prsAuthored: 0,
        prsReviewed: 0,
        pullUrl: pr.pullUrl,
      });
    }
    nodeMap.get(author).prsAuthored += 1;

    pr.reviews?.forEach((review) => {
      const reviewer = review.user.login;
      if (!nodeMap.has(reviewer)) {
        nodeMap.set(reviewer, {
          id: reviewer,
          prsAuthored: 0,
          prsReviewed: 0,
          pullUrl: pr.pullUrl,
        });
      }
      nodeMap.get(reviewer).prsReviewed += 1;

      const linkKey = `${reviewer}->${author}`;
      if (!linkMap.has(linkKey)) {
        linkMap.set(linkKey, { source: reviewer, target: author, count: 0 });
      }
      linkMap.get(linkKey).count += 1;
    });
  });

  return {
    nodes: Array.from(nodeMap.values()).filter((n) => n.id),
    links: Array.from(linkMap.values()).filter((l) => l.source && l.target),
  };
};

const NetworkGraph = ({ pullRequests, highlightedPrId }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  const graph = useMemo(() => buildGraph(pullRequests), [pullRequests]);

  useEffect(() => {
    if (!graph.nodes.length || !graph.links.length) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const container = svg.select(".graph-content");
    container.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const zoomHandler = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoomHandler);

    container
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graph.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.count));

    const node = container
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(graph.nodes)
      .join("circle")
      .attr("r", (d) => 5 + ((d.prsAuthored || 0) + (d.prsReviewed || 0)) * 1.5)
      .attr("fill", (d) =>
        highlightedPrId && d.pullUrl?.endsWith(`/${highlightedPrId}`)
          ? "#f87171"
          : "#60a5fa"
      )
      .style("cursor", "pointer")
      .call(drag(simulation))
      .on("mouseover", (event, d) => showTooltip(tooltip, event, d))
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"))
      .on("click", (event, d) => {
        if (d.pullUrl) window.open(d.pullUrl, "_blank");
      });

    simulation.on("tick", () => {
      container
        .selectAll("line")
        .attr("x1", (d) => d.source.x || 0)
        .attr("y1", (d) => d.source.y || 0)
        .attr("x2", (d) => d.target.x || 0)
        .attr("y2", (d) => d.target.y || 0);

      node
        .attr("cx", (d) => (isFinite(d.x) ? d.x : 0))
        .attr("cy", (d) => (isFinite(d.y) ? d.y : 0));
    });

    simulation.on("end", () => {
      fitGraphToView(svg, container, width, height, zoomHandler);
    });

    return () => container.selectAll("*").remove();
  }, [graph, highlightedPrId]);

  return (
    <>
      <div className="graph-container">
        <svg ref={svgRef} width="1400" height="650">
          <g className="graph-content" />
        </svg>
      </div>
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          position: "absolute",
          visibility: "hidden",
          backgroundColor: "#1f2937",
          color: "#d1d5db",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 1000,
          maxWidth: "300px",
        }}
      />
    </>
  );
};

export default React.memo(NetworkGraph);
