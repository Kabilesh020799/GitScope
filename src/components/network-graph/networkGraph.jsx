import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./style.scss";

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

function NetworkGraph({ pullRequests, highlightedPrId }) {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [graph, setGraph] = useState({ nodes: [], links: [] });

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

      pr.reviews.forEach((review) => {
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
      nodes: Array.from(nodeMap.values()),
      links: Array.from(linkMap.values()),
    };
  };

  useEffect(() => {
    const res = buildGraph(pullRequests);
    setGraph(res);
  }, [pullRequests]);

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

    const link = container
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
      .attr("r", (d) => 5 + (d.prsAuthored + d.prsReviewed) * 1.5)
      .attr("fill", (d) => {
        if (
          highlightedPrId &&
          Number(d.pullUrl.split("/").at(-1)) === Number(highlightedPrId)
        ) {
          return "#f87171"; // Red if highlighted
        }
        return "#60a5fa"; // Blue normally
      })
      .style("cursor", "pointer")
      .call(drag(simulation))
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").html(`
          <div style="padding: 8px 12px; color: #fff;">
            <strong>${d.id}</strong><br/>
            PRs Authored: ${d.prsAuthored}<br/>
            PRs Reviewed: ${d.prsReviewed}
          </div>
        `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        if (d.pullUrl) window.open(d.pullUrl, "_blank");
      });

    simulation.on("end", () => {
      // After simulation ends: fit viewBox to the network
      const bounds = container.node().getBBox();
      const fullWidth = bounds.width;
      const fullHeight = bounds.height;
      const midX = bounds.x + bounds.width / 2;
      const midY = bounds.y + bounds.height / 2;

      const scale = 0.85 / Math.max(fullWidth / width, fullHeight / height);
      const translate = [width / 2 - scale * midX, height / 2 - scale * midY];

      svg
        .transition()
        .duration(750)
        .call(
          zoomHandler.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    return () => {
      container.selectAll("*").remove();
    };
  }, [graph, highlightedPrId]);

  return (
    <>
      <div className="graph-container">
        <svg ref={svgRef} width="1400" height="650">
          <g className="graph-content"></g>
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
        }}
      />
    </>
  );
}

export default NetworkGraph;
