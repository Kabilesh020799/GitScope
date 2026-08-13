import React from "react";
import "./style.scss";

const RepoList = ({ repoList, onRepoSelect }) => {
  return (
    <div className="repo-list-container">
      <h2>Your Repositories</h2>
      <ul className="repo-list">
        {repoList.map((repoItem) => (
          <li key={repoItem.id}>
            <button
              type="button"
              className="repo-list-item"
              onClick={() => onRepoSelect(repoItem.url)}
              aria-label={`Analyze ${repoItem.name}`}
            >
              <span className="repo-content">
                <strong>{repoItem.name}</strong>
                <span>{repoItem.url}</span>
              </span>
              <span className="arrow" aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoList;
