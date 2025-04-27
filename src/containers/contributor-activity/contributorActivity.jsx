import React, { useEffect, useState, useMemo } from "react";
import "./style.scss";
import {
  addCreatedDate,
  addTotalCollaborators,
  replaceCollaborators,
} from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCollaborators } from "./apiUtils";
import { getCollaborators, getTotalCommits } from "../dashboard/apiUtils";
import BubbleChart from "../../components/bubble-chart";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import YearSelector from "../../components/year-selector";

const ContributorActivity = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { collaborators, totalCollaborators, createdYear } = useSelector(
    (state) => state.commitReducer
  );
  const filterYear = (weeks) => {
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
  };

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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        if (!totalCollaborators) {
          const collabRes = await getCollaborators();
          if (collabRes?.status !== 403) {
            dispatch(addTotalCollaborators({ data: collabRes?.length }));
          }
        }
        if (!createdYear) {
          const commitRes = await getTotalCommits();
          dispatch(addCreatedDate({ data: commitRes?.createdYear }));
        }
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [dispatch, totalCollaborators, createdYear]);

  useEffect(() => {
    if (totalCollaborators && !collaborators.length) {
      getAllCollaborators(Math.ceil(totalCollaborators / 100)).then((res) => {
        if (res?.status !== 403) {
          dispatch(replaceCollaborators({ data: res }));
        }
      });
    }
  }, [totalCollaborators, collaborators.length, dispatch]);

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
        <BubbleChart
          data={filteredCollabs.map((collaborator) => ({
            ...collaborator?.author,
            contributions: collaborator?.total,
            weeks: collaborator?.commits,
          }))}
        />
      )}
    </div>
  );
};

export default ContributorActivity;
