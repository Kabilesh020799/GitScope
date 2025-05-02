import React, { useCallback, useEffect, useState } from "react";
import LoginBackground from "./components/login-background";
import TypeAnimation from "../../components/type-animation";

import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchRepos } from "./apiCall";
import RepoList from "./components/repo-list";
import { useRepoActions } from "../../hooks/useRepoActions";

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);
  const [repo, setRepo] = useState("");
  const navigate = useNavigate();

  const { bearerToken } = useSelector((state) => state.signinReducer);
  const { createAndSelectRepo, selectExistingRepo } = useRepoActions();

  const welcomeText =
    "Welcome to GitScope! \n Let's begin by entering your repository name";

  const onContinue = useCallback(async () => {
    if (repo) createAndSelectRepo(repo);
  }, [repo, createAndSelectRepo]);

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
        {!bearerToken && !bearerToken.length && (
          <button
            className="repo-name-wrapper-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
      <div className="login-container-middle">
        <LoginBackground />
      </div>
      <div className="login-container-body">
        <div className="text-container">
          <TypeAnimation
            text={welcomeText}
            color="#8193b2"
            onDone={() => setIsTypeDone(true)}
          />
          {isTypeDone ? (
            <div className="repo-name">
              Enter the repository name*
              <div className="repo-name-wrapper">
                <input
                  className="repo-name-wrapper-input"
                  onChange={(e) => setRepo(e.target.value)}
                  value={repo}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onContinue();
                  }}
                />
                <button
                  className="repo-name-wrapper-btn"
                  onClick={onContinue}
                  disabled={!repo.trim()}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {repoList.length ? (
        <RepoList repoList={repoList} onRepoSelect={handleRepoClick} />
      ) : null}
    </div>
  );
};

export default Login;
