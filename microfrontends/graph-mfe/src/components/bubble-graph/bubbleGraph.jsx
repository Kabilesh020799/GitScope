import React, { useEffect, useMemo } from "react";
import * as d3 from "d3";

const BubbleGraph = ({ data, margin }) => {
  const processedData = useMemo(() => {
    if (!data || !data.length) return [];

    const result = [];

    data.forEach((user) => {
      Object.entries(user.weeks || {}).forEach(([month, entries]) => {
        const totalCommits = entries.reduce((sum, item) => sum + item.c, 0);
        result.push({
          login: user.login,
          month,
          commit: totalCommits,
        });
      });
    });

    return result;
  }, [data]);

  useEffect(() => {
    if (!processedData.length) return;

    d3.select(".bubble-graph").html("");

    const width = 500 - margin.left - margin.right;
    const height = 420 - margin.top - margin.bottom;

    const svg = d3
      .select(".bubble-graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right + 1050)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(processedData.map((d) => d.month))
      .range([0, width + 1050])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.commit) || 1])
      .range([height, 0]);

    const z = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.commit) || 1])
      .range([4, 40]);

    const color = d3
      .scaleOrdinal()
      .domain(processedData.map((d) => d.login))
      .range(d3.schemeSet2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style("color", "#8193b2");

    svg.append("g").call(d3.axisLeft(y)).style("color", "#8193b2");

    const tooltip = d3
      .select(".bubble-graph")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "#8193b2")
      .style("opacity", 0);

    svg
      .append("g")
      .selectAll("circle")
      .data(processedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.commit))
      .attr("r", (d) => z(d.commit))
      .style("fill", (d) => color(d.login))
      .on("mouseover", (_, d) => {
        tooltip
          .style("opacity", 1)
          .html(`${d.login}: ${d.commit}`)
          .style("left", `${d3.event.pageX + 10}px`)
          .style("top", `${d3.event.pageY - 20}px`);
      })
      .on("mousemove", () => {
        tooltip
          .style("left", `${d3.event.pageX + 10}px`)
          .style("top", `${d3.event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  }, [processedData, margin]);

  return <div className="bubble-graph" />;
};

BubbleGraph.defaultProps = {
  margin: { top: 10, right: 20, bottom: 30, left: 50 },
};

export default BubbleGraph;
