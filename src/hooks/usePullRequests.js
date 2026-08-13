import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPullRequests } from "../containers/contributor-relation/apiUtils";
import { setPullRequests } from "../containers/dashboard/reducer";

export const usePullRequests = () => {
  const dispatch = useDispatch();
  const repoUrl = useSelector((state) => state.loginReducer.repoUrl);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPullRequests("", repoUrl)
      .then((res) => {
        if (active) dispatch(setPullRequests({ data: res }));
      })
      .catch((error) => console.error("Failed to load pull requests", error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [dispatch, repoUrl]);

  return loading;
};
