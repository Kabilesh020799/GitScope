import React, { useEffect, useState, useCallback, useMemo } from "react";
import Heatmap from "../../components/heatmap";
import { addCreatedDate, replaceCommits } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCommits } from "./apiUtils";
import { getTotalCommits } from "../dashboard/apiUtils";
import "./style.scss";
import YearSelector from "../../components/year-selector";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const CommitActivity = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { commits, createdYear } = useSelector((state) => state.commitReducer);
  const { repoUrl } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contributorList = useMemo(
    () =>
      Array.from(
        new Set(commits.map((c) => c?.commit?.author?.name).filter(Boolean))
      ),
    [commits]
  );

  const filteredContributors = useMemo(
    () =>
      contributorList.filter(
        (name) =>
          name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedContributors.includes(name)
      ),
    [contributorList, searchQuery, selectedContributors]
  );

  const filteredCommits = useMemo(() => {
    if (!selectedContributors.length) return commits;
    return commits.filter((c) =>
      selectedContributors.includes(c?.commit?.author?.name)
    );
  }, [commits, selectedContributors]);

  const handleContributorSelect = (name) => {
    if (!selectedContributors.includes(name)) {
      setSelectedContributors((prev) => [...prev, name]);
      setSearchQuery("");
      setDropdownOpen(false);
    }
  };

  const handleRemoveChip = (name) => {
    setSelectedContributors((prev) => prev.filter((n) => n !== name));
  };

  const getCommits = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllCommits(
        `&since=${new Date(year, 0, 1)}&until=${new Date(
          year,
          11,
          31,
          23,
          59,
          59
        )}`
      );
      dispatch(replaceCommits({ data: result.length ? result : [] }));
    } finally {
      setLoading(false);
    }
  }, [year, dispatch]);

  const onSelectYear = (selectedYear) => {
    setYear(selectedYear);
  };

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

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
    return () => setYears([]);
  }, [createdYear]);

  useEffect(() => {
    getCommits();
    getTotalCommits().then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    });
  }, [year, getCommits, dispatch]);

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
