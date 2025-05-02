import React from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";

import Card from "../../components/card";
import "./style.scss";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import DashboardRowCard from "./components/dashboard-row-card";

const Dashboard = () => {
  const { totalCollaborators, totalCommits, totalPulls } = useSelector(
    (state) => state.commitReducer
  );
  const { repoUrl } = useSelector((state) => state.loginReducer);
  const loading = useDashboardStats(repoUrl);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <CircularProgress size={80} thickness={4} />
      </div>
    );
  }

  const cardData = [
    {
      name: "Commits",
      value: totalCommits,
      path: "/commit-activity",
      delay: 0.1,
    },
    {
      name: "Contributors",
      value: totalCollaborators,
      path: "/contributor-activity",
      delay: 0.3,
    },
    {
      name: "Active Pulls",
      value: totalPulls,
      path: "/contributor-relation",
      delay: 0.5,
    },
  ];

  const rowCards = [
    {
      title: "Analyze Sentiment of Comments",
      path: "/comment-activity",
      linkText: "Go to Comment Analysis",
    },
    {
      title: "Explore Individual User Contributions",
      path: "/user-contribution",
      linkText: "Go to User Contribution Analysis",
    },
  ];

  if (!repoUrl) {
    return (
      <div className="dashboard-error">
        <p>No repository selected. Please go back and choose a repository.</p>
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
        {cardData.map((card) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: card.delay }}
          >
            <Card
              name={card.name}
              value={card.value}
              path={card.path}
              loading={loading}
            />
          </motion.div>
        ))}
      </div>

      <div className="dashboard-contents">
        {rowCards.map((row) => (
          <motion.div
            key={row.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <DashboardRowCard {...row} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
