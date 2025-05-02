import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPullRequests } from "../containers/contributor-relation/apiUtils";
import { setPullRequests } from "../containers/dashboard/reducer";

export const usePullRequests = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPullRequests()
      .then((res) => {
        dispatch(setPullRequests({ data: res }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return loading;
};
