import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAllCommits } from "../containers/commit-activity/apiUtils";
import {
  addCreatedDate,
  replaceCommits,
} from "../containers/dashboard/reducer";
import { getTotalCommits } from "../containers/dashboard/apiUtils";

export const useCommitStats = (year) => {
  const { commits, createdYear } = useSelector((state) => state.commitReducer);
  const repoUrl = useSelector((state) => state.loginReducer.repoUrl);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const dispatch = useDispatch();

  const getCommits = useCallback(async () => {
    setLoading(true);
    try {
      const since = new Date(Date.UTC(year, 0, 1)).toISOString();
      const until = new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString();
      const result = await getAllCommits(
        `since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`,
        repoUrl
      );
      dispatch(replaceCommits({ data: result.length ? result : [] }));
    } finally {
      setLoading(false);
    }
  }, [year, dispatch, repoUrl]);

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
    getTotalCommits(repoUrl).then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    }).catch((error) => console.error("Failed to load commit range", error));
  }, [year, getCommits, dispatch, repoUrl]);

  return { years, commits, loading, createdYear };
};
