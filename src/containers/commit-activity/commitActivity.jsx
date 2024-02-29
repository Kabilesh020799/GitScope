import React, { useEffect, useState } from "react";
import Heatmap from "../../components/heatmap";
import { addCreatedDate, replaceCommits } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCommits } from "./apiUtils";
import { getTotalCommits } from "../dashboard/apiUtils";
import './style.scss';

const CommitActivity = () => {
  const [year, setYear] = useState(2023);
  const [years, setYears] = useState([]);

  const { commits, createdYear } = useSelector((state) => state.commitReducer);
  const dispatch = useDispatch();

  // getting commits of the repo from github
  const getCommits = async() => {
    let result = await getAllCommits(`&since=${new Date(year, 0, 1)}&until=${new Date(year, 11, 31, 23, 59, 0, 0)}`);
    if(result.length) {
      dispatch(replaceCommits({ data: result }));
    }
  };

  // onchange dropdown
  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  // useEffects block
  useEffect(() => {
    if(createdYear) {
      const firstYear = new Date(createdYear).getFullYear();
      const endYear = new Date().getFullYear();
      for(let year = firstYear;year <= endYear;year++) {
        if(!years.includes(year)) { 
          setYears((prevState) => ([...prevState, year]));
        }
      }
    }
    return () => setYears([]);
  }, [createdYear]);

  useEffect(() => {
    getCommits();
    getTotalCommits()
      .then((res) => {
        dispatch(addCreatedDate({ data: res.createdYear }));
      });
  }, [year]);

  return (
    <div className="commit-activity">
      <Heatmap data={commits} />
      <div
        className="commit-activity-years"
      >
        {years?.map((yearItem) => (
          <div
            key={yearItem.toString()}
            onClick={() => onSelectYear(yearItem)}
            className={`commit-activity-years-item ${year === yearItem ? 'focus' : ''}`}
          >
            {yearItem}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitActivity;
