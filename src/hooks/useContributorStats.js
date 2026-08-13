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
  const repoUrl = useSelector((state) => state.loginReducer.repoUrl);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        if (!totalCollaborators) {
          const collabRes = await getCollaborators(repoUrl);
          if (collabRes?.status !== 403) {
            dispatch(addTotalCollaborators({ data: collabRes?.length }));
          }
        }

        if (!createdYear) {
          const commitRes = await getTotalCommits(repoUrl);
          dispatch(addCreatedDate({ data: commitRes?.createdYear }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, totalCollaborators, createdYear, repoUrl]);

  useEffect(() => {
    const fetchYearlyCollaborators = async () => {
      if (createdYear) {
        try {
          setLoading(true);
          const filteredContributors =
            year === "all"
              ? await getAllCollaborators(repoUrl)
              : await getAllCollaboratorsByYear(Number(year), 5, 2000, repoUrl);
          dispatch(replaceCollaborators({ data: filteredContributors }));
        } catch (error) {
          console.error("Failed to fetch contributors by year:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchYearlyCollaborators();
  }, [year, createdYear, dispatch, repoUrl]);

  return { loading, collaborators, totalCollaborators, createdYear };
};
