import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { dates, months } from "./constants";
import "./style.scss";

const Heatmap = ({ data, margin }) => {
  const [processedData, setProcessedData] = useState([]);
  const [selectedDayCommits, setSelectedDayCommits] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});

  const convertCommitsToObject = (commits) => {
    const commitCounts = {};

    commits.forEach((commit) => {
      const date = new Date(commit.commit.author.date);
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const key = `${month}-${day}`;
      commitCounts[key] = (commitCounts[key] || 0) + 1;
    });

    const fullGrid = [];
    months.forEach((month) => {
      dates.forEach((date) => {
        const key = `${month}-${date}`;
        fullGrid.push({
          group: month,
          variable: date,
          value: commitCounts[key] || 0,
        });
      });
    });

    return fullGrid;
  };

  useEffect(() => {
    if (data.length) {
      setProcessedData(convertCommitsToObject(data));
    }
  }, [data]);

  useEffect(() => {
    if (!processedData.length) return;

    d3.select("#my_dataviz").html("");

    const totalWidth = Math.min(window.innerWidth - 60, 1000);
    const width = totalWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", totalWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).domain(dates).padding(0.01);
    const y = d3.scaleBand().range([height, 0]).domain(months).padding(0.01);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("color", "#8193b2");

    svg.append("g").call(d3.axisLeft(y)).attr("color", "#8193b2");

    const maxCommits = d3.max(processedData, (d) => d.value) || 1;

    const colorScale = d3
      .scaleLinear()
      .domain([0, maxCommits])
      .range(["#0D4429", "#39D353"]);

    svg
      .selectAll("rect")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.variable))
      .attr("y", (d) => y(d.group))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => (d.value ? colorScale(d.value) : "#2A3441"))
      .style("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        d3.select("#tooltip").style("visibility", "visible")
          .html(`<div style="text-align:center; font-weight:500;">
          Total Commits: ${d.value}
        </div>`);
      })
      .on("mousemove", (event) => {
        const tooltipWidth = 120;
        const tooltipHeight = 50;
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;

        let xPos = event.pageX - 400;
        let yPos = event.pageY - 150;

        if (xPos + tooltipWidth > pageWidth) {
          xPos = event.pageX - tooltipWidth - 15;
        }
        if (yPos + tooltipHeight > pageHeight) {
          yPos = event.pageY - tooltipHeight - 15;
        }

        d3.select("#tooltip")
          .style("left", `${xPos}px`)
          .style("top", `${yPos}px`);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        handleDayClick(d.group, d.variable);
      })
      .transition()
      .duration(800)
      .style("opacity", 1);
  }, [processedData, margin]);

  const handleDayClick = (month, day) => {
    const dayCommits = data
      .filter((commit) => {
        const date = new Date(commit.commit.author.date);
        const commitMonth = date.toLocaleString("default", { month: "short" });
        const commitDay = date.getDate();
        return commitMonth === month && commitDay === Number(day);
      })
      .sort(
        (a, b) =>
          new Date(b.commit.author.date) - new Date(a.commit.author.date)
      );

    setSelectedDayCommits(dayCommits);
    setSelectedDate(`${month} ${day}`);
    setShowModal(true);
    setExpandedMessages({});
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleExpand = (index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="heatmap-container">
      <div
        id="tooltip"
        style={{
          position: "absolute",
          backgroundColor: "#1f2937",
          color: "#d1d5db",
          padding: "8px 12px",
          border: "1px solid #374151",
          borderRadius: "8px",
          fontSize: "14px",
          pointerEvents: "none",
          zIndex: 1000,
          visibility: "hidden",
          width: "150px",
        }}
      />

      <div className="heatmap" id="my_dataviz" />
      {showModal && (
        <div className="heatmap-modal">
          <div className="heatmap-modal-content">
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <h2 className="modal-title">Commits on {selectedDate}</h2>

            {selectedDayCommits.length > 0 ? (
              <ul className="commit-list">
                {selectedDayCommits.map((commit, index) => {
                  const message = commit.commit.message;
                  const isLong = message.length > 100;
                  const expanded = expandedMessages[index];

                  return (
                    <li key={index} className="commit-item">
                      <div className="commit-author">
                        {commit.commit.author.name}
                      </div>
                      <div className="commit-message">
                        {expanded || !isLong ? (
                          `"${message}"`
                        ) : (
                          <>
                            &quot;{message.slice(0, 100)}...&quot;
                            <span
                              onClick={() => toggleExpand(index)}
                              style={{
                                color: "#60a5fa",
                                cursor: "pointer",
                                marginLeft: 5,
                              }}
                            >
                              Read more
                            </span>
                          </>
                        )}
                        {expanded && isLong && (
                          <div
                            onClick={() => toggleExpand(index)}
                            style={{
                              color: "#60a5fa",
                              cursor: "pointer",
                              marginTop: 5,
                            }}
                          >
                            Show less
                          </div>
                        )}
                      </div>
                      <div className="commit-time">
                        {new Date(commit.commit.author.date).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="no-commits">No commits found on this day.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Heatmap.defaultProps = {
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30,
  },
};

export default Heatmap;
