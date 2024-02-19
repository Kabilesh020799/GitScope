import React, { useEffect } from "react";
import Heatmap from "../../components/heatmap";
import { addCommits } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCommits } from "./apiUtils";

const CommitActivity = () => {
  const { commits } = useSelector((state) => state.commitReducer);
  const dispatch = useDispatch();

  // getting commits of the repo from github
  const getCommits = async() => {
    let result = await getAllCommits(`&since=${new Date(2023, 0, 1)}&until=${new Date(2023, 11, 31, 23, 59, 0, 0)}`);
    console.log(result);
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
