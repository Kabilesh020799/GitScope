import React, { useEffect, useState, useCallback } from "react";
import "./style.scss";
import BubbleChart from "../../components/bubble-chart";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import YearSelector from "../../components/year-selector";
import { useContributorStats } from "../../hooks/useContributorStats";

const ContributorActivity = () => {
  const [year, setYear] = useState("all");
  const [years, setYears] = useState([]);
  const navigate = useNavigate();
  const { collaborators, createdYear, loading } = useContributorStats(year);

  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

  const prepareBubbleChartData = useCallback(() => {
    return collaborators.map((c) => ({
      login: c.login,
      contributions: c.totalCommits,
      additions: c.totalAdditions,
      deletions: c.totalDeletions,
    }));
  }, [collaborators]);

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
  }, [createdYear]);

  return (
    <div className="contributor-activity">
      <div className="contributor-activity-header">
        <h1 className="contributor-activity-heading">
          Picture of the user contributions to your project
        </h1>
        <button className="contributor-activity-btn" onClick={onClickDashboard}>
          Go to Dashboard
        </button>
      </div>

      <YearSelector
        years={years}
        selectedYear={year}
        onSelectYear={onSelectYear}
        hasAllTime={true}
      />

      {loading ? (
        <div className="contributor-activity-loading">
          <CircularProgress />
        </div>
      ) : (
        <BubbleChart data={prepareBubbleChartData()} />
      )}
    </div>
  );
};

export default ContributorActivity;
