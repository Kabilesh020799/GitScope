import React, { useState } from "react";
import NetworkGraph from "../../components/network-graph/networkGraph";
import { useSelector } from "react-redux";
import "./style.scss";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePullRequests } from "../../hooks/usePullRequests";

const ContributorRelation = () => {
  const { pullRequests } = useSelector((state) => state.commitReducer);

  const [highlightedPrId, setHighlightedPrId] = useState(null);
  const navigate = useNavigate();

  const onClickDashboard = () => {
    navigate("/dashboard");
  };
  const loading = usePullRequests();

  return (
    <div className="contributor-relation">
      <div className="contributor-relation-header">
        <h1 className="contributor-relation-heading">
          Some Relations between the Collaborators with the active pullRequests
        </h1>
        <button className="commit-activity-btn" onClick={onClickDashboard}>
          Go to Dashboard
        </button>
      </div>
      <div className="contributor-relation-content">
        <span className="content-head">
          Please specify the pullRequest id you want to check
        </span>
        <input
          className="content-input"
          placeholder="Enter PR ID and press ENTER"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setHighlightedPrId(e.target.value);
            }
          }}
        />
      </div>
      {loading ? (
        <div className="contributor-relation-loader">
          <CircularProgress />
        </div>
      ) : pullRequests?.length ? (
        <NetworkGraph
          pullRequests={pullRequests}
          highlightedPrId={highlightedPrId}
        />
      ) : null}
    </div>
  );
};

export default ContributorRelation;
