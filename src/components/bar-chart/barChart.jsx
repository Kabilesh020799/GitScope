import React, { useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, classKey }) => {
  const dataEntries = Object.entries(data || {});
  const sortedEntries = dataEntries.sort((a, b) => b[1] - a[1])?.slice(0, 10);

  useEffect(() => {
    // Clean previous chart
    d3.select(`.bar-chart-${classKey}`).selectAll("*").remove();

    // Dimensions
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG
    const svg = d3
      .select(`.bar-chart-${classKey}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(sortedEntries.map((d) => d[0]))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("color", "#8193b2")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3
      .scaleLinear()
      .domain([0, sortedEntries?.[0]?.[1] || 10]) // fallback
      .range([height, 0]);

    svg.append("g").style("color", "#8193b2").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(sortedEntries)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1]))
      .attr("fill", "#69b3a2");
  }, [data, classKey]); // rerun when props change

  return <div className={`bar-chart-${classKey}`} />;
};

export default BarChart;
