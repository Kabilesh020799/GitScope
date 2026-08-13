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
            <div><p className="analytics-eyebrow">Repository insights</p>
              <h1>Commit activity</h1>
              <p>Explore contribution patterns across the calendar for <strong>{repoUrl}</strong>.</p>
            </div>
            <button className="commit-activity-btn" onClick={onClickDashboard}>
              <span aria-hidden="true">←</span> Dashboard
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
              placeholder="Filter by contributor…"
              aria-label="Search contributors"
              role="combobox"
              aria-expanded={dropdownOpen}
              aria-controls="contributor-options"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            />

            {dropdownOpen && filteredContributors.length > 0 && (
              <div id="contributor-options" className="contributor-dropdown" role="listbox">
                {filteredContributors.map((name) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    key={name}
                    className="contributor-dropdown-item"
                    onClick={() => handleContributorSelect(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            <div className="contributor-chips">
              {selectedContributors.map((name) => (
                <div key={name} className="chip">
                  {name}
                  <button
                    type="button"
                    className="remove-chip"
                    onClick={() => handleRemoveChip(name)}
                    aria-label={`Remove ${name} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="commit-activity-graphs">
        {loading ? (
          <div className="commit-activity-loading" role="status" aria-label="Loading commit activity">
            <CircularProgress size={60} />
            <span>Building your commit calendar…</span>
          </div>
        ) : commits.length > 0 ? (
          <Heatmap data={filteredCommits} />
        ) : (
          <div className="no-commits-text"><strong>No commits found</strong><span>Try another year or clear contributor filters.</span></div>
        )}
      </div>
    </div>
  );
};

export default CommitActivity;
