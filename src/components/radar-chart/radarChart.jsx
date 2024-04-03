import React, { useEffect } from "react";
import * as d3 from 'd3';

const RadarChart = (props) => {
  const {
    data,
  } = props;
console.log(data);
  useEffect(() => {
    const width = 500, height = 500;
    const margin = {top: 50, right: 80, bottom: 50, left: 80},
          chartRadius = Math.min(width, height) / 2 - Math.max(...Object.values(margin));

    const svg = d3.select(".radar-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    // Create the straight lines radiating from the center
    const radarLine = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(d => d.value * chartRadius)
      .angle((d,i) => i * 2 * Math.PI / data.length);

    // Append the backgrounds
    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("stroke", "darkblue")
      .attr("fill", "lightblue")
      .attr("fill-opacity", 0.1);

    // Create the axes
    data.forEach((d, i) => {
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", chartRadius * Math.cos(i * 2 * Math.PI / data.length - Math.PI / 2))
      .attr("y2", chartRadius * Math.sin(i * 2 * Math.PI / data.length - Math.PI / 2))
      .attr("stroke", "lightgray");

    // Add axis labels
    svg.append("text")
      .attr("x", (chartRadius + 10) * Math.cos(i * 2 * Math.PI / data.length - Math.PI / 2))
      .attr("y", (chartRadius + 10) * Math.sin(i * 2 * Math.PI / data.length - Math.PI / 2))
      .attr("text-anchor", "middle")
      .text(d.axis)
      .style('fill', '#555963');
    });

    // Draw the points
    svg.selectAll(".point")
    .data(data)
    .enter().append("circle")
      .attr("cx", d => chartRadius * d.value * Math.cos(radarLine.angle()(d) - Math.PI / 2))
      .attr("cy", d => chartRadius * d.value * Math.sin(radarLine.angle()(d) - Math.PI / 2))
      .attr("r", 4)
      .attr("fill", "darkblue");
    return () => d3.select('.radar-chart').html('');
  }, []);

  return (
    <div className="radar-chart" />
  );
};

export default RadarChart;