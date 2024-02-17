import React from "react";

const Heatmap = (props) => {
  const {
    margin,
  } = props;

  const width = 450 - margin.left - margin.right;
  const height =  450 - margin.top - margin.bottom;

  return(
    <div className="heatmap"></div>
  )
};

export default Heatmap;

Heatmap.defaultProps = {
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  }
};

