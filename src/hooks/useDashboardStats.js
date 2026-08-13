import { useDispatch } from "react-redux";
import {
  getCollaborators,
  getTotalCommits,
  getTotalPullRequests,
} from "../containers/dashboard/apiUtils";
import {
  addCreatedDate,
  addTotalCollaborators,
  addTotalCommits,
  setPulls,
} from "../containers/dashboard/reducer";
import { useEffect, useState } from "react";

export const useDashboardStats = (repoUrl) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(Boolean(repoUrl));

  useEffect(() => {
    let active = true;
    const fetchStats = async () => {
      setLoading(true);
      Promise.all([
        getTotalCommits(repoUrl).then((res) => {
          if (active) dispatch(addTotalCommits({ data: res?.length }));
          if (active) dispatch(addCreatedDate({ data: res?.createdYear }));
        }),
        getCollaborators(repoUrl).then((res) => {
          if (res.status !== 403) {
            if (active) dispatch(addTotalCollaborators({ data: res?.length }));
          }
        }),
        getTotalPullRequests(repoUrl).then((res) => {
          if (active) dispatch(setPulls({ data: res?.length }));
        }),
      ]).catch((error) => console.error("Failed to load dashboard", error))
        .finally(() => active && setLoading(false));
    };

    if (repoUrl) fetchStats();
    else setLoading(false);
    return () => { active = false; };
  }, [dispatch, repoUrl]);

  return loading;
};
