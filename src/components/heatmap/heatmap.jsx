import React, { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import { dates, months } from "./constants";
import './style.scss';

const Heatmap = (props) => {
  const {
    margin,
    data,
  } = props;

  const heatMapRef = useRef(null);
  const [emptyData, setEmptyData] = useState([]);
  const [convertData, setConvertedData] = useState([]);

  const findMissingValues = () => {
    months.forEach((month) => {
      if(convertData.findIndex((dataItem) => dataItem.group === month) === -1) {
        dates.forEach((date) => {
          setEmptyData((prevState) => ([...prevState, { group: month, variable: date }]));
        });
      } else {
        const filteredDates = convertData.filter((cD) => cD.group === month);
        dates.forEach((date) => {
          if(filteredDates?.findIndex((fD) => fD.variable === date) === -1) { 
            setEmptyData((prevState) => ([...prevState, { group: month, variable: date }]));
          }
        });
      }
    });
  };

  useEffect(() => {
    setConvertedData(convertCommitsToObject(data));
  }, [data]);

  useEffect(() => {
    if(convertData?.length) {
      findMissingValues();
    }
  }, [convertData]);

  useEffect(() => {
    const heat = () => {
      d3.select('#my_dataviz').html('');
      // set the dimensions and margins of the graph
      const width = 1000 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;
    
      // append the svg object to the body of the page
      var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      // Build X scales and axis:
      var x = d3.scaleBand()
        .range([0, width])
        .domain(dates)
        .padding(0.01);

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style('color', 'white')
        .call(d3.axisBottom(x));
    
      // Build Y scales and axis:
      var y = d3.scaleBand()
        .range([height, 0])
        .domain(months)
        .padding(0.01);
      svg.append("g")
        .style('color', 'white')
        .call(d3.axisLeft(y));
    
      // Build color scale
      var myColor = d3.scaleLinear()
        .range(["#0D4429", "#39D353" ])
        .domain([1, 100]);
    
      // Read the data
      const dataArr = convertData;
      // create a tooltip
      var tooltip = d3.select("#my_dataviz")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px");
    
        var mouseover = function() {
          tooltip.style("opacity", 1);
        };
        var mousemove = function(event, d) {
          tooltip
            .html("The total number of commits is " + d.value || 0)
            .style("left", (d3.pointer(this)[0] + 70) + "px")
            .style("top", (d3.pointer(this)[1]) + "px");
        };
        var mouseleave = function() {
          tooltip.style("opacity", 0);
        };

        // add the squares
        svg.selectAll()
          .data([...dataArr, ...emptyData])
          .enter()
          .append("rect")
          .attr("x", function(d) { return x(d.variable); })
          .attr("y", function(d) { return y(d.group); })
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .style("fill", function(d) {
            return d.value ? myColor(d.value) : "rgb(42 52 65)"; }
            )
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);
    };
    heat();
  }, [convertData, emptyData]);

  const convertCommitsToObject = (commits) => {
    const commitCounts = {};
  
    commits.forEach((commit) => {
      const date = new Date(commit.commit.author.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      const key = `${month}-${day}`;
  
      if (!commitCounts[key]) {
        commitCounts[key] = 0;
      }
  
      commitCounts[key]++;
    });
  
    return Object.keys(commitCounts).map((key) => ({
      group: key.split('-')[0], // month name
      variable: key.split('-')[1], // day of the month
      value: commitCounts[key].toString(), // total number of commits
    }));
  };

  return(
    <div
      className="heatmap"
      style={{marginTop: '10rem'}}
      ref={heatMapRef}
      id="my_dataviz"
    />
  );
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
