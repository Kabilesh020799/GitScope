import React, { useEffect } from "react";
import * as d3 from 'd3';
import cloud from "d3-cloud";

const WordMap = (props) => {
  const {
    words,
    margin,
    classKey,
  } = props;
  
  useEffect(() => {
    const width = 450 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
    var svg = d3.select(`.word-cloud-${classKey || ""}`).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    var layout = cloud()
    .size([width, height])
    .words(words.map(function(d) { return {text: d}; }))
    .padding(5)
    .rotate(-45)
    .fontSize(20)
    .on("end", draw);
    layout.start();

    function draw(words) {
    svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", 20)
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }

    return () => {d3.select(`.word-cloud-${classKey || ""}`).html('');};
  }, []);
  
  return (
    <div className={`word-cloud-${classKey || ""}`} />
  );
};

WordMap.defaultProps = {
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
};

export default WordMap;
