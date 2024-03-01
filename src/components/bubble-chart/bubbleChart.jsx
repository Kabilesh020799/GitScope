import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BubbleChart = (props) => {
  const {
    width,
    margin,
    data,
  } = props;

  const constructBubble = () => {
    const weeks = Object.values(data).map(week => {
      console.log(week);
      return ({
        value: week.contributions,
      });
    });

    // Set the dimensions of the chart
    const height = width;

    // Define the pack layout
    const pack = d3.pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

    // Compute the hierarchy and apply the pack layout
    const root = pack(d3.hierarchy({children: weeks})
        .sum(d => d.value));
    // Create the SVG container
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-margin, -margin, width, height])
        .style("max-width", "100%")
        .style("height", "auto")
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle");

    // Categorical color scale for visualization
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Place each leaf node
    const node = svg.append("g")
      .selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => {
          return `translate(${d.x},${d.y})`;
        });

    // Add titles for tooltips
    node.append("title")
        .text(d => `${d.data.id}\n${d.value} contributions`);

    // Add circles
    node.append("circle")
        .attr("fill-opacity", 0.7)
        .attr("fill", d => color(d.data.value))
        .attr("r", d => {
          console.log(d);
          return d.r|| 0;
        });

    // Add labels (optional based on space)
    node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") 
    .text(d => d.data.value);

    document.querySelector('.bubble-chart').appendChild(svg.node());
  };

  useEffect(() => {
    if(data.length) {
      console.log(data);
      constructBubble();
    }
  }, [data]);

  return(
    <div className='bubble-chart'>

    </div>
  );
};

BubbleChart.defaultProps = {
  width: 928,
  margin: 1,
};

export default BubbleChart;
