import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BubbleChart = ({ data, width = 928, margin = 1 }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    // Reset previous chart
    svg.selectAll("*").remove();
    tooltip.style("opacity", 0);

    const height = width;
    const nodesData = data.map((item, idx) => ({
      id: idx,
      value: item?.contributions || 0,
      login: item?.login || "Unknown",
    }));

    const pack = d3
      .pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

    const root = pack(
      d3.hierarchy({ children: nodesData }).sum((d) => d.value)
    );

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-margin, -margin, width, height])
      .style("maxWidth", "100%")
      .style("height", "auto")
      .style("fontFamily", "sans-serif")
      .attr("text-anchor", "middle");

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("id", (d) => `node-${d.data.id}`)
      .style("cursor", "pointer");

    // Draw circles
    nodeGroup
      .append("circle")
      .attr("r", 0)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => color(d.data.login))
      .transition()
      .duration(800)
      .attr("r", (d) => d.r || 0);

    // Add text
    nodeGroup
      .append("text")
      .text((d) => (d.r > 20 ? d.data.value : ""))
      .attr("dy", "0.35em")
      .style("fill", "#fff")
      .style("fontSize", (d) => (d.r > 40 ? "14px" : "10px"))
      .style("pointerEvents", "none");

    // Drag behavior
    const drag = d3
      .drag()
      .on("start", function () {
        d3.select(this).raise();
      })
      .on("drag", function (event, d) {
        d3.select(this).attr(
          "transform",
          `translate(${(d.x = event.x)},${(d.y = event.y)})`
        );
      });

    nodeGroup
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.r * 1.1);

        tooltip.style("opacity", 1).html(
          `<div style="padding: 8px 12px; color: white;">
              <strong>${d.data.login}</strong><br/>
              ${d.data.value} Contributions
            </div>`
        );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.r || 0);

        tooltip.style("opacity", 0);
      })
      .call(drag);
  }, [data, width, margin]);

  return (
    <div
      className="bubble-chart"
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "#1f2937",
          color: "#d1d5db",
          padding: "8px 12px",
          border: "1px solid #374151",
          borderRadius: "8px",
          fontSize: "14px",
          pointerEvents: "none",
          opacity: 0,
          whiteSpace: "nowrap",
          zIndex: 1000,
        }}
      />
    </div>
  );
};

export default BubbleChart;
