import React, { useEffect, useState } from "react";
import RadarChart from "../../components/radar-chart";
import { fetchGitHubData } from "./apiUtils";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import './style.scss';
import { useDispatch, useSelector } from "react-redux";
import { replaceCollaborators } from "../dashboard/reducer";
import { getAllCollaborators } from "../contributor-activity/apiUtils";
import { useNavigate } from "react-router-dom";

const UserContributions = () => {
  const dispatch = useDispatch();
  const { collaborators } = useSelector( state => state.commitReducer );
  const [dropdownValue, setDropdownValue] = useState('');
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onClickDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    setLoading(true);
    getAllCollaborators()
      .then((res) => {
        if(res.status !== 403) {
          dispatch(replaceCollaborators({ data: res }));
        }
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSelectDropdown = (value) => {
    setDropdownValue(value.target.value);
    setLoading(true);
    fetchGitHubData(value.target.value)
      .then((res) => {
        const radarChartData = [
          {axis: "Commits", value: res.commits},
          {axis: "Pull Requests", value: res.pullRequests},
          {axis: "Code Reviews", value: res.codeReviews}
        ];
        setRadarData(radarChartData);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="user-contributions">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', marginBottom: '50px', marginTop: '30px' }}>
        <h1 className="user-contributions-heading">Get to know about each User&apos;s contribution</h1>
        <button
          className="commit-activity-btn"
          onClick={onClickDashboard}
        >
          Go to Dashboard
        </button>
      </div>
        <FormControl className="user-contributions-dropdown">
          <InputLabel id="demo-simple-select-label" style={{ color: '#8193b2' }}>Select User</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select User"
            onChange={onSelectDropdown}
            value={dropdownValue}
            style={{ color: '#8193b2' }}
          >
            {collaborators?.map((collaborator) => (
              <MenuItem key={collaborator?.author?.login} value={collaborator?.author?.login}>{collaborator?.author?.login}</MenuItem>
            ))}
          </Select>
        </FormControl>
        { dropdownValue ? <span style={{ color: '#8193b2' }}>Blue Line indicates the user contribution</span> : null }
      { loading ? (
        <div style={{ height: 'calc(100% - 100px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        radarData ? (<RadarChart data={radarData} />) : null
      ) }
    </div>
  );
};

export default UserContributions;
