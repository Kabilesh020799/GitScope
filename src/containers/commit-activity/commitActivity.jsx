import React, { useEffect, useState } from "react";
import Heatmap from "../../components/heatmap";
import { addCommits, addCreatedDate } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
import { getAllCommits } from "./apiUtils";
import { getTotalCommits } from "../dashboard/apiUtils";

const CommitActivity = () => {
  const [year,] = useState(2024);
  const { commits, createdYear } = useSelector((state) => state.commitReducer);
  const dispatch = useDispatch();
console.log(createdYear);

// getting commits of the repo from github
  const getCommits = async() => {
    let result = await getAllCommits(`&since=${new Date(year, 0, 1)}&until=${new Date(year, 11, 31, 23, 59, 0, 0)}`);
    if(result.length) {
      dispatch(addCommits({data: result}));
    }
  };

  useEffect(() => {
    if(!commits.length) {
      getCommits();
      getTotalCommits()
        .then((res) => {
          dispatch(addCreatedDate({ data: res.createdYear }));
        });
    }
  }, [commits]);

  return (
    <div className="commit-activity">
      <select className=""></select>
      <Heatmap data={commits} />
    </div>
  );
};

export default CommitActivity;
