import React from "react";
import "./style.scss";

const YearSelector = ({ years, selectedYear, onSelectYear }) => {
  return (
    <div className="year-selector">
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
