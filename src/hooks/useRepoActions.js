import { useDispatch } from "react-redux";
import { addRepository } from "../containers/login/apiCall";
import { addRepoUrl } from "../containers/login/reducer";
import { setStorage } from "../utils/common-utils";
import { useNavigate } from "react-router-dom";

export const useRepoActions = (bearerToken) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createAndSelectRepo = async (repo) => {
    setStorage("repo-url", repo);
    await addRepository(repo, bearerToken);
    dispatch(addRepoUrl({ data: repo }));
    navigate("/dashboard");
  };

  const selectExistingRepo = (url) => {
    setStorage("repo-url", url);
    dispatch(addRepoUrl({ data: url }));
    navigate("/dashboard");
  };

  return {
    createAndSelectRepo,
    selectExistingRepo,
  };
};
