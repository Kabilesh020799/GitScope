import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const BubbleGraph = (props) => {
  const { data, margin } = props;

  const [newData, setNewData] = useState([]);

  useEffect(() => {
    data?.forEach((dataItem) => {
      Object.keys(dataItem?.weeks)?.map((week) => {
        setNewData((prevState) => [
          ...prevState,
          {
            ...dataItem,
            commit: dataItem?.weeks?.[week]?.reduce(
              (acc, item) => acc + item.c,
              0
            ),
            month: week,
          },
        ]);
      });
    });
  }, [data]);

  const constructBubbleGraph = () => {
    // set the dimensions and margins of the graph
    var width = 500 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom;
    const minContributions = newData.reduce(
      (min, obj) => Math.min(min, obj.commit),
      Infinity
    );
    const maxContributions = newData.reduce(
      (max, obj) => Math.max(max, obj.commit),
      -Infinity
    );

    // append the svg object to the body of the page
    var svg = d3
      .select(".bubble-graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right + 1050)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
      .scaleBand()
      .domain(newData?.map((dataItem) => dataItem?.month))
      .range([0, width + 1050])
      .padding(0.1);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style("color", "#8193b2");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([minContributions, maxContributions])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y)).style("color", "#8193b2");

    // Add a scale for bubble size
    var z = d3
      .scaleLinear()
      .domain([0, d3.max(newData, (d) => d.commit)])
      .range([4, 40]);

    // Add a scale for bubble color
    var myColor = d3
      .scaleOrdinal()
      .domain(newData?.map((dataItem) => dataItem?.login))
      .range(d3.schemeSet2);

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3
      .select(".bubble-graph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "#8193b2");

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (_, d) {
      tooltip.transition().duration(200);
      tooltip
        .style("opacity", 1)
        .html(`${d.login}: ${d.commit}`)
        .style("left", d3.pointer(this)[0] + 30 + "px")
        .style("top", d3.pointer(this)[1] + 30 + "px");
    };
    var moveTooltip = function () {
      tooltip
        .style("left", d3.pointer(this)[0] + 30 + "px")
        .style("top", d3.pointer(this)[1] + 30 + "px");
    };
    var hideTooltip = function () {
      tooltip.transition().duration(200).style("opacity", 0);
    };

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(newData)
      .enter()
      .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) {
        return x(d.month) + x.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        return y(d.commit);
      })
      .attr("r", function (d) {
        return z(d.commit);
      })
      .style("fill", function (d) {
        return myColor(d.login);
      })
      // -3- Trigger the functions
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);
  };

  useEffect(() => {
    if (newData.length) {
      d3.select(".bubble-graph").html("");
      constructBubbleGraph();
    }
  }, [newData]);

  return <div className="bubble-graph"></div>;
};

BubbleGraph.defaultProps = {
  margin: {
    top: 10,
    right: 20,
    bottom: 30,
    left: 50,
  },
};

export default BubbleGraph;
