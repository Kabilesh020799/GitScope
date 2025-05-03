import React, { useEffect } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordMap = (props) => {
  const {
    words,
    margin = { top: 10, right: 10, bottom: 10, ledt: 10 },
    classKey = "",
    fontSize = 20,
    rotate = () => -45,
    fillColor = "#69b3a2",
  } = props;

  useEffect(() => {
    const width = 450 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    var svg = d3
      .select(`.word-cloud-${classKey}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    var layout = cloud()
      .size([width, height])
      .words(words.map((text) => ({ text })))
      .padding(5)
      .rotate(rotate)
      .fontSize(fontSize)
      .on("end", draw);

    layout.start();

    function draw(words) {
      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .text((d) => d.text)
        .style("font-size", fontSize)
        .style("fill", fillColor)
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr(
          "transform",
          (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`
        );
    }

    return () => {
      d3.select(`.word-cloud-${classKey}`).html("");
    };
  }, [words, margin, classKey, fontSize, rotate, fillColor]);

  return <div className={`word-cloud-${classKey || ""}`} />;
};

export default WordMap;
