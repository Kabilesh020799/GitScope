import React from "react";
import { addRepoUrl } from "../../reducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { setStorage } from "../../../../utils/common-utils";

const RepoList = (props) => {
  const { repoList } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="repo-list-container">
      <h2>Your Repositories</h2>
      <ul className="repo-list">
        {repoList.map((repoItem) => (
          <li
            key={repoItem.id}
            className="repo-list-item"
            onClick={() => {
              setStorage("repo-url", repoItem.url);
              dispatch(addRepoUrl({ data: repoItem.url }));
              navigate("/dashboard");
            }}
          >
            <div className="repo-content">
              <strong>{repoItem.name}</strong>
              <p>{repoItem.url}</p>
            </div>
            <span className="arrow">→</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoList;
