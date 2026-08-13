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
      <header className="contributor-activity-header">
        <div><p className="analytics-eyebrow">Team pulse</p><h1 className="contributor-activity-heading">Contributor activity</h1><p>Compare commit volume and discover the people moving the project forward.</p></div>
        <button className="contributor-activity-btn" onClick={onClickDashboard}>
          <span aria-hidden="true">←</span> Dashboard
        </button>
      </header>

      <YearSelector
        years={years}
        selectedYear={year}
        onSelectYear={onSelectYear}
        hasAllTime={true}
      />

      {loading ? (
        <div className="contributor-activity-loading" role="status">
          <CircularProgress />
          <span>Calculating contributor activity…</span>
        </div>
      ) : collaborators.length ? (
        <BubbleChart data={prepareBubbleChartData()} />
      ) : (
        <div className="contributor-activity-empty"><strong>No contributor activity found</strong><span>Try another reporting period.</span></div>
      )}
    </div>
  );
};

export default ContributorActivity;
