import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './style.scss';

const drag = simulation => {
  
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
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};


function NetworkGraph(props) {
  const {
    pullRequests,
    highlightedPrId,
  } = props;

  const svgRef = useRef();
  const tooltipRef = useRef();
  const [graph, setGraph] = useState({ nodes: [], links: [] });

  const buildGraph = (pullRequests) => {
    const graph = { nodes: [], links: [] };
    const contributors = new Set();

    pullRequests.forEach(pr => {
        const author = pr.user.login; // PR author
        contributors.add({ reviewer: author, pullUrl: pr.pullUrl });
        pr.reviews.forEach(review => {
            const reviewer = review.user.login; // Reviewer
            contributors.add({ reviewer, pullUrl: pr.pullUrl});
            graph.links.push({ source: reviewer, target: author });
        });
    });
    graph.nodes = [...(contributors || [])].map(contributor => ({ id: contributor?.reviewer, pullUrl: contributor?.pullUrl }));
    return graph;
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
    const radius = 30;

    const zoomHandler = d3.zoom()
    .scaleExtent([0.5, 5])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });
    svg.call(zoomHandler)
    .call(zoomHandler.transform, d3.zoomIdentity);

    const simulation = d3.forceSimulation(graph.nodes)
      .force("link", d3.forceLink(graph.links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .selectAll("line")
      .data(graph.links)
      .join("line");

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(graph.nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => Number(d.pullUrl.split('/').at(-1)) == highlightedPrId ? "red" : "blue")
      .call(drag(simulation))
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
               .text(`${d.id} - ${d.pullUrl}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px")
               .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        window.open(d.pullUrl, "_blank");
      });

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node.attr("cx", d => d.x = Math.max(radius, Math.min(width - radius, d.x)))  // Ensure nodes stay within horizontal bounds
      .attr("cy", d => d.y = Math.max(radius, Math.min(height - radius, d.y)));
    });

    return () => {
      svg.selectAll("*").remove();
    };
  }, [graph, highlightedPrId]);

  return (
    <>
      <div className='graph-container'>
        <svg ref={svgRef} width="1400" height="650" >
          <g className="graph-content"></g>
        </svg>
      </div>
      <div ref={tooltipRef} className="tooltip" style={{ position: 'absolute', visibility: 'hidden', backgroundColor: 'lightgrey', padding: '5px', borderRadius: '5px' }}></div>
    </>
  );
}

export default NetworkGraph;
