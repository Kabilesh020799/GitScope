import React from "react";
import './style.scss';

const YearSelector = (props) => {
  const {
    years,
    selectedYear,
    onSelectYear,
  } = props;

  return (
    <div className="year-selector">
      {years?.map((yearItem) => (
        <div
          key={yearItem.toString()}
          onClick={() => onSelectYear(yearItem)}
          className={`year-selector-item ${selectedYear === yearItem ? 'focus' : ''}`}
        >
          {yearItem}
        </div>
      ))
      }
    </div>
  );
};

export default YearSelector;
