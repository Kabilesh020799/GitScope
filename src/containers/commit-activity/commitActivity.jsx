import React, { useEffect } from "react";
import Heatmap from "../../components/heatmap";
import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";
import { addCommits } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";

const CommitActivity = () => {
  const { commits } = useSelector((state) => state.commitReducer);
  const dispatch = useDispatch();
  const repoUrl = getStorage('repo-url');

  // getting commits of the repo from github
  const getCommits = async() => {
    let result = await api.get(constructGitUrl(repoUrl, 'commits?per_page=100'));
    if(result.length) {
      dispatch(addCommits({data: result}));
    }
  };

  useEffect(() => {
    if(!commits.length) {
      getCommits();
    }
  }, [commits]);

  return (
    <div className="commit-activity">
      <Heatmap data={commits} />
    </div>
  );
};

export default CommitActivity;
