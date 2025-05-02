import React from "react";
import "./style.scss";

const RepoList = ({ repoList, onRepoSelect }) => {
  return (
    <div className="repo-list-container">
      <h2>Your Repositories</h2>
      <ul className="repo-list">
        {repoList.map((repoItem) => (
          <li
            key={repoItem.id}
            className="repo-list-item"
            onClick={onRepoSelect(repoItem.url)}
            onKeyDown={(e) => e.key === "Enter" && onRepoSelect(repoItem.url)}
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
