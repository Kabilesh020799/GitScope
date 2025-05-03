import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./style.scss";
import BubbleChart from "../../components/bubble-chart";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import YearSelector from "../../components/year-selector";
import { useContributorStats } from "../../hooks/useContributorStats";

const ContributorActivity = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const navigate = useNavigate();
  const { collaborators, createdYear, loading } = useContributorStats();

  const filterYear = useCallback(
    (weeks) => {
      const filteredYear = weeks?.filter(
        (week) => new Date(week?.w * 1000).getFullYear() === year
      );
      const monthlyData = {};

      filteredYear?.forEach((yearItem) => {
        const date = new Date(yearItem?.w * 1000);
        const month = date.getMonth() + 1;
        if (!monthlyData[month]) monthlyData[month] = [];
        monthlyData[month].push(yearItem);
      });
      return monthlyData;
    },
    [year]
  );

  // Memoized filtered collaborators based on year
  const filteredCollabs = useMemo(() => {
    if (!collaborators?.length) return [];
    return collaborators.map((collaborator) => ({
      ...collaborator,
      commits: filterYear(collaborator?.weeks),
    }));
  }, [collaborators, year]);

  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

  const prepareBubbleChartData = useCallback((filteredCollabs) => {
    return filteredCollabs.map((collaborator) => ({
      ...collaborator?.author,
      contributions: collaborator?.total,
      weeks: collaborator?.commits,
    }));
  }, []);

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
      />

      {loading ? (
        <div className="contributor-activity-loading">
          <CircularProgress />
        </div>
      ) : (
        <BubbleChart data={prepareBubbleChartData(filteredCollabs)} />
      )}
    </div>
  );
};

export default ContributorActivity;
