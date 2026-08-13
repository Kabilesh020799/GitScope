import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordMap = (props) => {
  const {
    words,
    margin = { top: 10, right: 10, bottom: 10, left: 10 },
    classKey = "",
    fontSize = 20,
    rotate = () => -45,
    fillColor = "#69b3a2",
  } = props;
  const rootRef = useRef(null);

  useEffect(() => {
    const rootNode = rootRef.current;
    const width = 450 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    var svg = d3
      .select(rootNode)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("role", "img")
      .attr("aria-label", `${classKey || "Comment"} word cloud`)
      .style("width", "100%")
      .style("height", "auto")
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
      d3.select(rootNode).selectAll("*").remove();
    };
  }, [words, margin, classKey, fontSize, rotate, fillColor]);

  return <div ref={rootRef} className={`word-cloud word-cloud-${classKey || ""}`} />;
};

export default WordMap;
