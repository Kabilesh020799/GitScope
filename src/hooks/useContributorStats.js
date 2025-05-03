import { useDispatch, useSelector } from "react-redux";
import {
  getCollaborators,
  getTotalCommits,
} from "../containers/dashboard/apiUtils";
import {
  addCreatedDate,
  addTotalCollaborators,
  replaceCollaborators,
} from "../containers/dashboard/reducer";
import {
  getAllCollaborators,
  getAllCollaboratorsByYear,
} from "../containers/contributor-activity/apiUtils";
import { useEffect, useState } from "react";

export const useContributorStats = (year) => {
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
    const fetchYearlyCollaborators = async () => {
      if (createdYear) {
        try {
          setLoading(true);
          const filteredContributors =
            year === "all"
              ? await getAllCollaborators()
              : await getAllCollaboratorsByYear(Number(year));
          dispatch(replaceCollaborators({ data: filteredContributors }));
        } catch (error) {
          console.error("Failed to fetch contributors by year:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchYearlyCollaborators();
  }, [year, createdYear, dispatch]);

  return { loading, collaborators, totalCollaborators, createdYear };
};
