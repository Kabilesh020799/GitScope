import React, { useEffect, useState } from "react";
import Heatmap from "../../components/heatmap";
import { addCreatedDate, replaceCommits } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCommits } from "./apiUtils";
import { getTotalCommits } from "../dashboard/apiUtils";
import "./style.scss";
import YearSelector from "../../components/year-selector";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const CommitActivity = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);

  const { commits, createdYear } = useSelector((state) => state.commitReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // getting commits of the repo from github
  const getCommits = async () => {
    let result = await getAllCommits(
      `&since=${new Date(year, 0, 1)}&until=${new Date(
        year,
        11,
        31,
        23,
        59,
        0,
        0
      )}`
    );
    if (result.length) {
      dispatch(replaceCommits({ data: result }));
    }
  };

  // onchange dropdown
  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

  // useEffects block
  useEffect(() => {
    if (createdYear) {
      const firstYear = new Date(createdYear).getFullYear();
      const endYear = new Date().getFullYear();
      for (let year = firstYear; year <= endYear; year++) {
        if (!years.includes(year)) {
          setYears((prevState) => [...prevState, year]);
        }
      }
    }
    return () => setYears([]);
  }, [createdYear]);

  useEffect(() => {
    setLoading(true);
    getCommits().finally(() => {
      setLoading(false);
    });
    getTotalCommits().then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    });
  }, [year]);

  return (
    <div className="commit-activity">
      <div className="commit-activity-wrapper">
        <header className="commit-activity-header">
          Commit history of the repo for the year {year}
        </header>
        <button className="commit-activity-btn" onClick={onClickDashboard}>
          Go to Dashboard
        </button>
      </div>
      <div className="commit-activity-graphs">
        {loading ? (
          <div
            style={{
              height: "calc(100% - 100px)",
              width: "960px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Heatmap data={commits} />
        )}
        <YearSelector
          years={years}
          selectedYear={year}
          onSelectYear={onSelectYear}
        />
      </div>
    </div>
  );
};

export default CommitActivity;
