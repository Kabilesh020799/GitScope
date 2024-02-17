import React from "react";

const Heatmap = (props) => {
  const {
    margin,
  } = props;

  const width = 450 - margin.left - margin.right;
  const height =  450 - margin.top - margin.bottom;

  const svg = d3.select('.heatmap')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  return(
    <div className="heatmap"></div>
  )
};

Heatmap.defaultProps = {
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  }
};

export default Heatmap;

