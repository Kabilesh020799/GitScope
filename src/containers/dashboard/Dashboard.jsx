import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";

import Card from "../../components/card";
import {
  addCreatedDate,
  addTotalCommits,
  addTotalCollaborators,
  setPulls,
} from "../dashboard/reducer";
import {
  getCollaborators,
  getTotalCommits,
  getTotalPullRequests,
} from "./apiUtils";

import "./style.scss";

const Dashboard = () => {
  const { totalCollaborators, totalCommits, totalPulls } = useSelector(
    (state) => state.commitReducer
  );

  const { repoUrl } = useSelector((state) => state.loginReducer);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTotalCommits(repoUrl).then((res) => {
        dispatch(addTotalCommits({ data: res?.length }));
        dispatch(addCreatedDate({ data: res?.createdYear }));
      }),
      getCollaborators(repoUrl).then((res) => {
        if (res.status !== 403) {
          dispatch(addTotalCollaborators({ data: res?.length }));
        }
      }),
      getTotalPullRequests(repoUrl).then((res) => {
        dispatch(setPulls({ data: res?.length }));
      }),
    ]).finally(() => {
      setLoading(false);
    });
  }, [dispatch, repoUrl]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <CircularProgress size={80} thickness={4} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Git Scope Dashboard
      </motion.h1>

      <div className="dashboard-cards">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card
            name="Commits"
            value={totalCommits}
            path="/commit-activity"
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card
            name="Contributors"
            value={totalCollaborators}
            path="/contributor-activity"
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card
            name="Active Pulls"
            value={totalPulls}
            path="/contributor-relation"
            loading={loading}
          />
        </motion.div>
      </div>

      <div className="dashboard-contents">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DashboardRowCard
            title="Analyze Sentiment of Comments"
            path="/comment-activity"
            linkText="Go to Comment Analysis"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <DashboardRowCard
            title="Explore Individual User Contributions"
            path="/user-contribution"
            linkText="Go to User Contribution Analysis"
          />
        </motion.div>
      </div>
    </div>
  );
};

const DashboardRowCard = ({ title, path, linkText }) => (
  <div className="row-card">
    <span className="row-text">{title}</span>
    <NavLink className="nav-link" to={path}>
      {linkText}
      <i className="fa-solid fa-arrow-right"></i>
    </NavLink>
  </div>
);

export default Dashboard;
