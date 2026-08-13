import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComments } from "../containers/comment-activity/apiUtils";
import {
  addCreatedDate,
  clearLoading,
  setComments,
  setLoading,
} from "../containers/dashboard/reducer";
import { getTotalCommits } from "../containers/dashboard/apiUtils";

export const useCommentData = (year) => {
  const dispatch = useDispatch();
  const repoUrl = useSelector((state) => state.loginReducer.repoUrl);

  useEffect(() => {
    dispatch(setLoading());

    let active = true;
    getAllComments({ year, repoUrl })
      .then((res) => {
        if (active) dispatch(setComments({ data: res }));
      })
      .finally(() => {
        if (active) dispatch(clearLoading());
      })
      .catch(() => {
        if (active) dispatch(clearLoading());
      });

    getTotalCommits(repoUrl).then((res) => {
      if (active) dispatch(addCreatedDate({ data: res.createdYear }));
    }).catch((error) => console.error("Failed to load repository dates", error));
    return () => { active = false; };
  }, [year, repoUrl, dispatch]);
};
