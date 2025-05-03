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
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const dispatch = useDispatch();

  const getCommits = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllCommits(
        `&since=${new Date(year, 0, 1)}&until=${new Date(
          year,
          11,
          31,
          23,
          59,
          59
        )}`
      );
      dispatch(replaceCommits({ data: result.length ? result : [] }));
    } finally {
      setLoading(false);
    }
  }, [year, dispatch]);

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
    getTotalCommits().then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    });
  }, [year, getCommits, dispatch]);

  return { years, commits, loading, createdYear };
};
