import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { dates, months } from "./constants";
import "./style.scss";

const DEFAULT_MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };

const Heatmap = ({ data, margin = DEFAULT_MARGIN }) => {
  const [selectedDayCommits, setSelectedDayCommits] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleDayClick = useCallback((month, day) => {
    const dayCommits = data
      .filter((commit) => {
        const date = new Date(commit?.commit?.author?.date);
        return date.toLocaleString("default", { month: "short" }) === month && date.getDate() === Number(day);
      })
      .sort((a, b) => new Date(b?.commit?.author?.date) - new Date(a?.commit?.author?.date));
    setSelectedDayCommits(dayCommits);
    setSelectedDate(`${month} ${day}`);
    setShowModal(true);
    setExpandedMessages({});
  }, [data]);

  const processedData = useMemo(() => {
    if (!data.length) return [];
    const commitCounts = {};

    data.forEach((commit) => {
      const date = new Date(commit?.commit?.author?.date);
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
  }, [data]);

  useEffect(() => {
    if (!processedData.length) return;

    const root = d3.select(chartRef.current);
    root.selectAll("*").remove();

    const totalWidth = Math.min(window.innerWidth - 60, 1000);
    const width = totalWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", totalWidth)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${totalWidth} ${height + margin.top + margin.bottom}`)
      .attr("role", "img")
      .attr("aria-label", "Commit activity heatmap by month and day")
      .style("width", "100%")
      .style("height", "auto")
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
      .data(processedData, (d) => `${d.group}-${d.variable}`)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => x(d.variable))
            .attr("y", (d) => y(d.group))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => (d.value ? colorScale(d.value) : "#2A3441"))
            .style("opacity", 0)
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
              d3.select(tooltipRef.current)
                .style("visibility", "visible")
                .text(`Total Commits: ${d.value}`);
            })
            .on("mousemove", (event) => {
              const tooltipWidth = 150;
              const tooltipHeight = 50;
              const xPos = Math.min(
                event.pageX + 10,
                window.innerWidth - tooltipWidth - 10
              );
              const yPos = Math.min(
                event.pageY - tooltipHeight,
                window.innerHeight - tooltipHeight - 10
              );

              d3.select(tooltipRef.current)
                .style("left", `${xPos}px`)
                .style("top", `${yPos}px`);
            })
            .on("mouseleave", () => {
              d3.select(tooltipRef.current).style("visibility", "hidden");
            })
            .on("click", (event, d) => {
              handleDayClick(d.group, d.variable);
            })
            .call((enter) =>
              enter.transition().duration(800).style("opacity", 1)
            ),
        (update) => update,
        (exit) => exit.remove()
      );
  }, [processedData, margin, handleDayClick]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedDayCommits([]);
    setSelectedDate("");
  }, []);

  useEffect(() => {
    if (!showModal) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal, closeModal]);

  const toggleExpand = useCallback((index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  return (
    <div className="heatmap-container">
      {!data.length ? (
        <div className="heatmap-container-no-commits">
          No commits to display
        </div>
      ) : null}
      <div
        ref={tooltipRef}
        role="status"
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

      <div className="heatmap" ref={chartRef} />
      {showModal && (
        <div className="heatmap-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <div
            className="heatmap-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="heatmap-modal-title"
          >
            <button className="modal-close" onClick={closeModal} aria-label="Close commit details">
              ×
            </button>
            <h2 className="modal-title" id="heatmap-modal-title">Commits on {selectedDate}</h2>

            {selectedDayCommits.length > 0 ? (
              <ul className="commit-list">
                {selectedDayCommits.map((commit, index) => {
                  const message = commit.commit.message;
                  const isLong = message.length > 100;
                  const expanded = expandedMessages[index];

                  return (
                    <li key={index} className="commit-item">
                      <div className="commit-author">
                        {commit?.commit?.author?.name}
                      </div>
                      <div className="commit-message">
                        {expanded || !isLong ? (
                          `"${message}"`
                        ) : (
                          <>
                            &quot;{message.slice(0, 100)}...&quot;
                            <button
                              type="button"
                              onClick={() => toggleExpand(index)}
                              style={{
                                color: "#60a5fa",
                                cursor: "pointer",
                                marginLeft: 5,
                              }}
                            >
                              Read more
                            </button>
                          </>
                        )}
                        {expanded && isLong && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(index)}
                            style={{
                              color: "#60a5fa",
                              cursor: "pointer",
                              marginTop: 5,
                            }}
                          >
                            Show less
                          </button>
                        )}
                      </div>
                      <div className="commit-time">
                        {new Date(
                          commit?.commit?.author?.date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

export default Heatmap;
