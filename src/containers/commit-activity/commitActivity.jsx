import React, { useState } from "react";
import Heatmap from "../../components/heatmap";
import { useSelector } from "react-redux";
import "./style.scss";
import YearSelector from "../../components/year-selector";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useCommitStats } from "../../hooks/useCommitStats";
import { useContributorFilter } from "../../hooks/useContributorFilter";

const CommitActivity = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { repoUrl } = useSelector((state) => state.loginReducer);
  const navigate = useNavigate();
  const { years, commits, loading } = useCommitStats(year);
  const {
    searchQuery,
    setSearchQuery,
    selectedContributors,
    dropdownOpen,
    setDropdownOpen,
    filteredContributors,
    filteredCommits,
    handleContributorSelect,
    handleRemoveChip,
  } = useContributorFilter(commits);

  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="commit-activity">
      <div className="commit-activity-wrapper">
        <div className="commit-activity-header-section">
          <header className="commit-activity-header">
            <div>
              Commit history of the repo for
              <span style={{ color: "#1d4ed8" }}> {repoUrl}</span>
            </div>
            <button className="commit-activity-btn" onClick={onClickDashboard}>
              Go to Dashboard
            </button>
          </header>

          <YearSelector
            years={years}
            selectedYear={year}
            onSelectYear={onSelectYear}
          />

          <div className="contributor-search-container">
            <input
              type="text"
              className="contributor-search-input"
              placeholder="Search contributor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            />

            {dropdownOpen && filteredContributors.length > 0 && (
              <div className="contributor-dropdown">
                {filteredContributors.map((name) => (
                  <div
                    key={name}
                    className="contributor-dropdown-item"
                    onClick={() => handleContributorSelect(name)}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}

            <div className="contributor-chips">
              {selectedContributors.map((name) => (
                <div key={name} className="chip">
                  {name}
                  <span
                    className="remove-chip"
                    onClick={() => handleRemoveChip(name)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="commit-activity-graphs">
        {loading ? (
          <div className="commit-activity-loading">
            <CircularProgress size={60} />
          </div>
        ) : commits.length > 0 ? (
          <Heatmap data={filteredCommits} />
        ) : (
          <div className="no-commits-text">No Commits Found For {year}</div>
        )}
      </div>
    </div>
  );
};

export default CommitActivity;
