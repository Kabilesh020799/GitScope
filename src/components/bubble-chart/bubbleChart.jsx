import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BubbleChart = (props) => {
  const {
    width,
    margin,
    data,
  } = props;

    // Define what happens when dragging starts

  const constructBubble = () => {
    const weeks = Object.values(data).map(week => ({
        value: week?.contributions,
        login: week?.login,
      }));
    const initialPositions = {};

    const dragstarted = (event, d) => {
      initialPositions[d.data.id] = { x: d.x, y: d.y }; // Store the initial position of the dragged node
  
      d3.select(this).raise().attr("stroke", "black");
    };
  
    // Define what happens when dragging
    const dragged = (event, d) => {
      d3.select(this)
        .attr("cx", d.x = event.x)
        .attr("cy", d.y = event.y);
    };
  
  
    // Define what happens when dragging ends
    const dragended = (event, draggedNode) => {
      root.leaves().forEach(node => {
        if (node === draggedNode) return; // Skip the node that was just dragged
        const dx = node.x - draggedNode.x;
        const dy = node.y - draggedNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = node.r + draggedNode.r;
  
        if (distance < minDistance) {
          // Calculate the angle of movement
          const angle = Math.atan2(dy, dx);
  
          // Push the overlapping node away
          node.x += Math.cos(angle) * (minDistance - distance);
          node.y += Math.sin(angle) * (minDistance - distance);
  
          // Update the position of the pushed node
          d3.select(`[id="node-${node.data.id}"]`)
            .attr("transform", `translate(${node.x}, ${node.y})`);
        }
      });
    };

    const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

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
        .text(d => `${d.data.login}\n${d.value} contributions`);

    // Add circles
    node.append("circle")
        .attr("fill-opacity", 0.7)
        .attr("fill", d => color(d.data.value))
        .attr("r", d => d.r|| 0);

    // Add labels (optional based on space)
    node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") 
    .style("font-weight", 'bold')
    .style("font-size", '13px')
    .text(d => d.data.value);
    node.call(drag);

    document.querySelector('.bubble-chart').appendChild(svg.node());
  };

  useEffect(() => {
    if(data.length) {
      constructBubble();
    }

    return () => {
      d3.select('.bubble-chart').html('');
    };
  }, [data]);

  return(
    <div
      className='bubble-chart'
      style={{ 
        display: 'flex',
        justifyContent: 'center',
      }}
    />
  );
};

BubbleChart.defaultProps = {
  width: 928,
  margin: 1,
};

export default BubbleChart;
