import React, { useCallback, useEffect, useState } from "react";
import RadarChart from "../../components/radar-chart";
import { fetchGitHubData } from "./apiUtils";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { replaceCollaborators } from "../dashboard/reducer";
import { getAllCollaborators } from "../contributor-activity/apiUtils";
import { useNavigate } from "react-router-dom";

const UserContributions = () => {
  const dispatch = useDispatch();
  const { collaborators } = useSelector((state) => state.commitReducer);
  const repoUrl = useSelector((state) => state.loginReducer.repoUrl);
  const [dropdownValue, setDropdownValue] = useState("");
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onClickDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    setError("");
    let active = true;
    getAllCollaborators(repoUrl)
      .then((res) => {
        if (active) {
          dispatch(replaceCollaborators({ data: res }));
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setError("We couldn't load the contributor list. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [dispatch, repoUrl]);

  const onSelectDropdown = useCallback((value) => {
    const selectedUser = value.target.value;
    setDropdownValue(selectedUser);
    setLoading(true);
    setError("");
    fetchGitHubData(selectedUser)
      .then((res) => {
        setRadarData([
          { axis: "Commits", value: res.commits },
          { axis: "Pull Requests", value: res.pullRequests },
          { axis: "Code Reviews", value: res.codeReviews },
        ]);
      })
      .catch((err) => {
        console.error(err);
        setError("We couldn't load this contributor's activity. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="user-contributions">
      <header className="user-contributions-header">
        <div><p className="analytics-eyebrow">Individual impact</p><h1 className="user-contributions-heading">Contributor profile</h1><p>Compare commits, pull requests, and code reviews for each teammate.</p></div>
        <button className="commit-activity-btn" onClick={onClickDashboard}>
          <span aria-hidden="true">←</span> Dashboard
        </button>
      </header>
      <section className="user-contributions-panel" aria-label="Contributor activity explorer">
      <FormControl className="user-contributions-dropdown">
        <InputLabel id="contributor-select-label">
          Select User
        </InputLabel>
        <Select
          labelId="contributor-select-label"
          id="contributor-select"
          label="Select User"
          onChange={onSelectDropdown}
          value={dropdownValue}
        >
          {collaborators?.map((collaborator) => (
            <MenuItem
              key={collaborator?.login}
              value={collaborator?.login}
            >
              {collaborator?.login}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {dropdownValue ? (
        <p className="user-contributions-legend"><i aria-hidden="true" /> Activity relative to this contributor&apos;s strongest metric</p>
      ) : null}
      {error && <div className="user-contributions-error" role="alert">{error}</div>}
      {loading ? (
        <div className="user-contributions-loading" role="status">
          <CircularProgress />
          <span>Loading contributor activity…</span>
        </div>
      ) : radarData ? (
        <RadarChart data={radarData} />
      ) : !error ? <div className="user-contributions-empty"><strong>Select a contributor</strong><span>Their activity profile will appear here.</span></div> : null}
      </section>
    </div>
  );
};

export default UserContributions;
