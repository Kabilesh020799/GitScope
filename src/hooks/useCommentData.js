import { useEffect } from "react";
import { useDispatch } from "react-redux";
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

  useEffect(() => {
    dispatch(setLoading());

    getAllComments({ year })
      .then((res) => {
        dispatch(setComments({ data: res }));
      })
      .finally(() => {
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });

    getTotalCommits().then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    });
  }, [year]);
};
