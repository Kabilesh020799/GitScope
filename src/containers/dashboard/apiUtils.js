import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";
import { store } from "../../store";

const stateRepoUrl = store.getState()?.loginReducer?.repoUrl;
const repoUrl = getStorage("repo-url") || stateRepoUrl;

// get commits info for the repo
const getCommits = async (filter, repoUrlState) => {
  const result = await api.get(
    constructGitUrl(
      repoUrl || repoUrlState,
      `commits?per_page=100&${filter ? `${filter}` : ""}`
    )
  );
  return result;
};

// get pulls info for the repo
const getPulls = async (filter, repoUrlState) => {
  const result = await api.get(
    constructGitUrl(
      repoUrl || repoUrlState,
      `pulls?per_page=100&${filter ? `${filter}` : ""}`
    )
  );
  return result;
};

const getCollab = async (filter, repoUrlState) => {
  let result = await api.get(
    constructGitUrl(
      repoUrl || repoUrlState,
      `contributors?per_page=100&${filter ? `${filter}` : ""}`
    )
  );
  return result;
};

// get total commits infor for the repo
const getTotalCommits = async (repoUrlState) => {
  let result = await getCommits("", repoUrlState);
  const resultLink = result.headers.get("Link")?.split(",");
  const lastPageLink = resultLink?.find((resultItem) =>
    resultItem.includes('rel="last"')
  );
  if (lastPageLink) {
    const lastPage = lastPageLink.match(/&page=(\d+)>/)[1];
    let lastPageCommits = await getCommits(`page=${lastPage}`, repoUrlState);
    lastPageCommits = await lastPageCommits.json();
    return {
      length: lastPageCommits.length + 100 * (lastPage - 1),
      createdYear:
        lastPageCommits?.[lastPageCommits?.length - 1]?.commit?.author?.date,
    };
  }
  result = await result.json();
  return {
    length: result?.length,
    createdYear: result?.[result?.length - 1]?.commit?.author?.date,
  };
};

// get total pull requests infor for the repo
const getTotalPullRequests = async (repoUrlState) => {
  let result = await getPulls("", repoUrlState);
  const resultLink = result.headers.get("Link")?.split(",");
  const lastPageLink = resultLink?.find((resultItem) =>
    resultItem.includes('rel="last"')
  );
  if (lastPageLink) {
    const lastPage = lastPageLink.match(/&page=(\d+)>/)[1];
    let lastPageCommits = await getPulls(`page=${lastPage}`, repoUrlState);
    lastPageCommits = await lastPageCommits.json();
    return { length: lastPageCommits.length + 100 * (lastPage - 1) };
  }
  result = await result.json();
  return { length: result?.length };
};

// getting collaborators info of the repo
const getCollaborators = async (repoUrlState) => {
  let result = await getCollab("", repoUrlState);
  const resultLink = result.headers?.get("Link")?.split(",");
  const lastPageLink = resultLink?.find((resultItem) =>
    resultItem.includes('rel="last"')
  );
  if (lastPageLink) {
    const lastPage = lastPageLink.match(/&page=(\d+)>/)[1];
    let lastPageCommits = await getCollab(`page=${lastPage}`, repoUrlState);
    lastPageCommits = await lastPageCommits.json();
    return { length: lastPageCommits?.length + 100 * (lastPage - 1) };
  }
  result = await result.json();
  return { length: result?.length };
};

const getUserLocation = async (filter, page = 1) => {
  let result = await api.get(
    constructGitUrl(
      repoUrl,
      `contributors?per_page=100&${filter ? `${filter}` : ""}&page=${page}`
    )
  );
  const resultLink = result.headers.get("Link")?.split(",");
  const nextPageLink = resultLink?.find((resultItem) =>
    resultItem.includes('rel="next"')
  );
  result = await result.json();
  if (nextPageLink) {
    return [...result, ...(await getUserLocation(filter, page + 1))];
  }
  return [...result];
};

export {
  getTotalCommits,
  getCommits,
  getCollaborators,
  getUserLocation,
  getTotalPullRequests,
};
