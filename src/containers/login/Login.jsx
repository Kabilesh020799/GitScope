import React, { useCallback, useEffect, useState } from "react";
import LoginBackground from "./components/login-background";

import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchRepos } from "./apiCall";
import RepoList from "./components/repo-list";
import { useRepoActions } from "../../hooks/useRepoActions";

const Login = () => {
  const [repo, setRepo] = useState("");
  const navigate = useNavigate();

  const { bearerToken } = useSelector((state) => state.signinReducer);
  const { createAndSelectRepo, selectExistingRepo } =
    useRepoActions(bearerToken);

  const onContinue = useCallback(async () => {
    if (!bearerToken) {
      navigate("/login");
      return;
    }
    if (repo) createAndSelectRepo(repo);
  }, [repo, bearerToken, createAndSelectRepo, navigate]);

  const handleRepoClick = useCallback(
    (url) => selectExistingRepo(url),
    [selectExistingRepo]
  );

  const [repoList, setRepoList] = useState([]);

  useEffect(() => {
    const fetchRepoList = async () => {
      const fetchedRepos = await fetchRepos(bearerToken);
      setRepoList(fetchedRepos);
    };

    if (bearerToken) fetchRepoList();
  }, [bearerToken]);

  return (
    <div className="login-container">
      <div className="login-container-header">
        <div className="brand" aria-label="GitScope home">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span>GitScope</span>
        </div>
        {!bearerToken && (
          <button
            className="repo-name-wrapper-btn"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        )}
      </div>
      <div className="login-container-middle">
        <LoginBackground />
      </div>
      <div className="login-container-body">
        <div className="text-container">
          <span className="eyebrow">Repository intelligence, in seconds</span>
          <h1>Understand the people and patterns behind your code.</h1>
          <p className="hero-copy">
            Turn GitHub activity into clear, useful insights for your team.
          </p>
          <div className="repo-name">
            <label htmlFor="repository-name">GitHub repository</label>
            <div className="repo-name-wrapper">
              <input
                id="repository-name"
                className="repo-name-wrapper-input"
                onChange={(e) => setRepo(e.target.value)}
                value={repo}
                placeholder="owner/repository"
                autoComplete="off"
                spellCheck="false"
                aria-describedby={!bearerToken ? "repo-auth-note" : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onContinue();
                }}
              />
              <button
                className="repo-name-wrapper-btn"
                onClick={onContinue}
                disabled={!repo.trim() || !bearerToken}
              >
                Analyze repository
              </button>
            </div>
            {!bearerToken && (
              <p id="repo-auth-note" className="auth-note">
                Sign in first to analyze private or public repositories.
              </p>
            )}
          </div>
        </div>
      </div>
      {repoList?.length ? (
        <RepoList repoList={repoList} onRepoSelect={handleRepoClick} />
      ) : null}
    </div>
  );
};

export default Login;
