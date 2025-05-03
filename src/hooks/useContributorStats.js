import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getCollaborators,
  getTotalCommits,
} from "../containers/dashboard/apiUtils";
import {
  addCreatedDate,
  addTotalCollaborators,
  replaceCollaborators,
} from "../containers/dashboard/reducer";
import { getAllCollaborators } from "../containers/contributor-activity/apiUtils";
import { useEffect, useState } from "react";

export const useContributorStats = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { collaborators, totalCollaborators, createdYear } = useSelector(
    (state) => state.commitReducer
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!totalCollaborators) {
          const collabRes = await getCollaborators();
          if (collabRes?.status !== 403) {
            dispatch(addTotalCollaborators({ data: collabRes?.length }));
          }
        }
        if (!createdYear) {
          const commitRes = await getTotalCommits();
          dispatch(addCreatedDate({ data: commitRes?.createdYear }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, totalCollaborators, createdYear]);

  useEffect(() => {
    if (totalCollaborators && !collaborators.length) {
      getAllCollaborators(Math.ceil(totalCollaborators / 100)).then((res) => {
        if (res?.status !== 403) {
          dispatch(replaceCollaborators({ data: res }));
        }
      });
    }
  }, [totalCollaborators, collaborators.length, dispatch]);

  return { loading, collaborators, totalCollaborators, createdYear };
};
