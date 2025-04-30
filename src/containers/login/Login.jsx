import React, { useEffect, useState } from "react";
import LoginBackground from "./components/login-background";
import TypeAnimation from "../../components/type-animation";
import { useDispatch } from "react-redux";

import "./style.scss";
import { useNavigate } from "react-router-dom";
import { setStorage } from "../../utils/common-utils";
import { addRepoUrl } from "./reducer";
import { useSelector } from "react-redux";
import { addRepository, fetchRepos } from "./apiCall";
import RepoList from "./components/repo-list";

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);
  const [repo, setRepo] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bearerToken } = useSelector((state) => state.signinReducer);

  const welcomeText =
    "Welcome to GitScope! \n Let's begin by entering your repository name";

  const onContinue = async () => {
    if (repo) {
      setStorage("repo-url", repo);
      addRepository(repo, bearerToken);
      dispatch(addRepoUrl({ data: repo }));
      navigate("/dashboard");
    }
  };

  const [repoList, setRepoList] = useState([]);

  useEffect(() => {
    const onRender = async () => {
      const data = await fetchRepos(bearerToken);
      setRepoList(data);
    };

    if (bearerToken) onRender();
  }, [bearerToken]);

  return (
    <div className="login-container">
      <div className="login-container-header">
        {!bearerToken.length && (
          <button
            className="repo-name-wrapper-btn"
            onClick={() => navigate("/login")}
            style={{ zIndex: 10, marginRight: "20px" }}
          >
            Login
          </button>
        )}
      </div>
      <div style={{ zIndex: 1, position: "absolute" }}>
        <LoginBackground />
      </div>
      <div
        style={{ zIndex: 10, position: "relative" }}
        className="login-container-body"
      >
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
                />
                <button className="repo-name-wrapper-btn" onClick={onContinue}>
                  Continue
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <RepoList repoList={repoList} />
    </div>
  );
};

export default Login;
