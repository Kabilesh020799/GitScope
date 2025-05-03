import React from "react";
import "./style.scss";

const YearSelector = ({
  years,
  selectedYear,
  onSelectYear,
  hasAllTime = false,
}) => {
  return (
    <div className="year-selector">
      {hasAllTime && years.length && (
        <div
          key="all"
          onClick={() => onSelectYear("all")}
          className={`year-selector-item ${
            selectedYear === "all" ? "selected" : ""
          }`}
        >
          All Time
        </div>
      )}
      {years.map((yearItem) => (
        <div
          key={yearItem}
          onClick={() => onSelectYear(yearItem)}
          className={`year-selector-item ${
            selectedYear === yearItem ? "selected" : ""
          }`}
        >
          {yearItem}
        </div>
      ))}
    </div>
  );
};

export default YearSelector;
