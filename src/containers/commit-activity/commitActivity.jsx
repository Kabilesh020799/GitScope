import React, { useEffect, useState, useCallback } from "react";
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
  const { repoUrl } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCommits = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllCommits(
        `&since=${new Date(year, 0, 1)}&until=${new Date(
          year,
          11,
          31,
          23,
          59,
          59
        )}`
      );
      dispatch(replaceCommits({ data: result.length ? result : [] }));
    } finally {
      setLoading(false);
    }
  }, [year, dispatch]);

  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (createdYear) {
      const firstYear = new Date(createdYear).getFullYear();
      const endYear = new Date().getFullYear();
      const generatedYears = [];
      for (let y = endYear; y >= firstYear; y--) {
        generatedYears.push(y);
      }
      setYears(generatedYears);
    }
    return () => setYears([]);
  }, [createdYear]);

  useEffect(() => {
    getCommits();
    getTotalCommits().then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    });
  }, [year, getCommits, dispatch]);

  return (
    <div className="commit-activity">
      <div className="commit-activity-wrapper">
        <div className="commit-activity-header-section">
          <header className="commit-activity-header">
            <div>
              Commit history of the repo for
              <span
                style={{
                  color: "#1d4ed8",
                }}
              >
                {" "}
                {repoUrl}
              </span>
            </div>
            <button className="commit-activity-btn" onClick={onClickDashboard}>
              Go to Dashboard
            </button>
          </header>
          <YearSelector
            years={years}
            selectedYear={year}
            onSelectYear={onSelectYear}
          />
        </div>
      </div>

      <div className="commit-activity-graphs">
        {loading ? (
          <div className="commit-activity-loading">
            <CircularProgress size={60} />
          </div>
        ) : commits.length > 0 ? (
          <Heatmap data={commits} />
        ) : (
          <div className="no-commits-text">No Commits Found For {year}</div>
        )}
      </div>
    </div>
  );
};

export default CommitActivity;
