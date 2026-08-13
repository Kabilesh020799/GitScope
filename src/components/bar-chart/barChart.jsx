import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data, classKey }) => {
  const sortedEntries = useMemo(
    () => Object.entries(data || {}).sort((a, b) => b[1] - a[1]).slice(0, 10),
    [data]
  );
  const rootRef = useRef(null);

  useEffect(() => {
    // Clean previous chart
    const root = d3.select(rootRef.current);
    root.selectAll("*").remove();

    // Dimensions
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG
    const svg = d3
      .select(rootRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("role", "img")
      .attr("aria-label", `Top ${classKey} words by frequency`)
      .style("width", "100%")
      .style("height", "auto")
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
      .attr("rx", 4)
      .attr("fill", classKey === "negative" ? "#fb7185" : "#34d399");
  }, [sortedEntries, classKey]);

  return <div ref={rootRef} className={`bar-chart bar-chart-${classKey}`} />;
};

export default BarChart;
