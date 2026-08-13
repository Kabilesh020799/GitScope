import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const RadarChart = (props) => {
  const { data } = props;
  const rootRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return null;

    const width = 500,
      height = 500;
    const margin = { top: 50, right: 80, bottom: 50, left: 80 },
      chartRadius =
        Math.min(width, height) / 2 - Math.max(...Object.values(margin));

    const root = d3.select(rootRef.current);
    root.selectAll("*").remove();
    const maxValue = d3.max(data, (d) => d.value) || 1;
    const normalizedData = data.map((d) => ({ ...d, normalized: d.value / maxValue }));
    const svg = root
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Contributor activity comparison")
      .style("width", "100%")
      .style("height", "auto")
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create the straight lines radiating from the center
    const radarLine = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d) => d.normalized * chartRadius)
      .angle((d, i) => (i * 2 * Math.PI) / data.length);

    // Append the backgrounds
    svg
      .append("path")
      .datum(normalizedData)
      .attr("d", radarLine)
      .attr("stroke", "darkblue")
      .attr("fill", "lightblue")
      .attr("fill-opacity", 0.1);

    // Create the axes
    data.forEach((d, i) => {
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr(
          "x2",
          chartRadius * Math.cos((i * 2 * Math.PI) / data.length - Math.PI / 2)
        )
        .attr(
          "y2",
          chartRadius * Math.sin((i * 2 * Math.PI) / data.length - Math.PI / 2)
        )
        .attr("stroke", "lightgray");

      // Add axis labels
      svg
        .append("text")
        .attr(
          "x",
          (chartRadius + 10) *
            Math.cos((i * 2 * Math.PI) / data.length - Math.PI / 2)
        )
        .attr(
          "y",
          (chartRadius + 10) *
            Math.sin((i * 2 * Math.PI) / data.length - Math.PI / 2)
        )
        .attr("text-anchor", "middle")
        .text(`${d.axis} · ${d.value}`)
        .style("fill", "#a8b3c7")
        .style("font-size", "13px");
    });

    // Draw the points
    svg
      .selectAll(".point")
      .data(normalizedData)
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d) =>
          chartRadius * d.normalized * Math.cos(radarLine.angle()(d) - Math.PI / 2)
      )
      .attr(
        "cy",
        (d) =>
          chartRadius * d.normalized * Math.sin(radarLine.angle()(d) - Math.PI / 2)
      )
      .attr("r", 4)
      .attr("fill", "darkblue");

    return () => root.selectAll("*").remove();
  }, [data]);

  return <div ref={rootRef} className="radar-chart" />;
};

export default React.memo(RadarChart);
