import React from "react";
import "./style.scss";

const YearSelector = ({
  years,
  selectedYear,
  onSelectYear,
  hasAllTime = false,
}) => {
  return (
    <div className="year-selector" role="group" aria-label="Select reporting period">
      {hasAllTime && years.length && (
        <button
          type="button"
          key="all"
          onClick={() => onSelectYear("all")}
          className={`year-selector-item ${
            selectedYear === "all" ? "selected" : ""
          }`}
          aria-pressed={selectedYear === "all"}
        >
          All Time
        </button>
      )}
      {years.map((yearItem) => (
        <button
          type="button"
          key={yearItem}
          onClick={() => onSelectYear(yearItem)}
          className={`year-selector-item ${
            selectedYear === yearItem ? "selected" : ""
          }`}
          aria-pressed={selectedYear === yearItem}
        >
          {yearItem}
        </button>
      ))}
    </div>
  );
};

export default YearSelector;
