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
  const [prInput, setPrInput] = useState("");
  const navigate = useNavigate();

  const onClickDashboard = () => {
    navigate("/dashboard");
  };
  const loading = usePullRequests();

  return (
    <div className="contributor-relation">
      <header className="contributor-relation-header">
        <div><p className="analytics-eyebrow">Collaboration map</p><h1 className="contributor-relation-heading">Contributor relationships</h1><p>Explore who authors and reviews pull requests across this repository.</p></div>
        <button className="commit-activity-btn" onClick={onClickDashboard}>
          <span aria-hidden="true">←</span> Dashboard
        </button>
      </header>
      <form className="contributor-relation-content" onSubmit={(event) => { event.preventDefault(); setHighlightedPrId(prInput.trim() || null); }}>
        <label className="content-head" htmlFor="pr-highlight">Highlight a pull request</label>
        <div className="content-control">
        <input
          id="pr-highlight"
          className="content-input"
          inputMode="numeric"
          placeholder="e.g. 142"
          value={prInput}
          onChange={(event) => setPrInput(event.target.value)}
        />
        <button type="submit">Highlight</button></div>
      </form>
      {loading ? (
        <div className="contributor-relation-loader">
          <CircularProgress />
        </div>
      ) : pullRequests?.length ? (
        <NetworkGraph
          pullRequests={pullRequests}
          highlightedPrId={highlightedPrId}
        />
      ) : <div className="contributor-relation-empty"><strong>No review relationships yet</strong><span>Relationships appear when pull requests receive reviews.</span></div>}
    </div>
  );
};

export default ContributorRelation;
