import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";
import { store } from "../../store";

const PAGE_SIZE = 100;

const makeGitUrl = (endpoint, repoUrlState) =>
  constructGitUrl(resolveRepoUrl(repoUrlState), endpoint);

const resolveRepoUrl = (repoUrlState) =>
  repoUrlState ||
  getStorage("repo-url") ||
  store.getState()?.loginReducer?.repoUrl;

// get commits info for the repo
const getCommits = async (filter, repoUrlState) => {
  const result = await api.get(
    constructGitUrl(
      resolveRepoUrl(repoUrlState),
      `commits?per_page=100&${filter ? `${filter}` : ""}`
    )
  );
  return result;
};

// get pulls info for the repo
const getPulls = async (filter, repoUrlState) => {
  const result = await api.get(
    constructGitUrl(
      resolveRepoUrl(repoUrlState),
      `pulls?per_page=100&${filter ? `${filter}` : ""}`
    )
  );
  return result;
};

const getCollab = async (filter, repoUrlState) => {
  let result = await api.get(
    constructGitUrl(
      resolveRepoUrl(repoUrlState),
      `contributors?per_page=100&${filter ? `${filter}` : ""}`
    )
  );
  return result;
};

const fetchLastPageCount = async (getPageFn, repoUrlState) => {
  let result = await getPageFn("", repoUrlState);
  const linkHeader = result.headers.get("Link")?.split(",");
  const lastPageLink = linkHeader?.find((resultItem) =>
    resultItem.includes('rel="last"')
  );

  if (lastPageLink) {
    const match = lastPageLink.match(/&page=(\d+)>/);
    const lastPage = match ? Number(match[1]) : 1;

    const lastPageResponse = await getPageFn(`page=${lastPage}`, repoUrlState);
    const lastPageData = await lastPageResponse.json();

    return {
      total: lastPageData.length + PAGE_SIZE * (lastPage - 1),
      lastPageData,
    };
  }
  const data = await result.json();
  return {
    total: data?.length,
    lastPageData: data,
  };
};

// get total commits infor for the repo
const getTotalCommits = async (repoUrlState) => {
  const { total, lastPageData } = await fetchLastPageCount(
    getCommits,
    repoUrlState
  );

  return {
    length: total,
    createdYear: lastPageData?.[lastPageData?.length - 1]?.commit?.author?.date,
  };
};

// get total pull requests infor for the repo
const getTotalPullRequests = async (repoUrlState) => {
  const { total } = await fetchLastPageCount(getPulls, repoUrlState);

  return {
    length: total,
  };
};

// getting collaborators info of the repo
const getCollaborators = async (repoUrlState) => {
  const { total, lastPageData } = await fetchLastPageCount(
    getCollab,
    repoUrlState
  );

  return {
    length: total,
    createdYear: lastPageData?.[lastPageData?.length - 1]?.commit?.author?.date,
  };
};

const getAllPages = async (baseUrlBuilder, page = 1, accumulator = []) => {
  const res = await api.get(baseUrlBuilder(page));
  const linkHeader = res.headers.get("Link")?.split(",");
  const nextPage = linkHeader?.some((item) => item.includes('rel="next"'));
  const data = await res.json();

  if (nextPage) {
    return getAllPages(baseUrlBuilder, page + 1, [...accumulator, ...data]);
  }

  return [...accumulator, ...data];
};

const getUserLocation = async (filter, repoUrlState) =>
  getAllPages((page) =>
    makeGitUrl(
      `contributors?per_page=100&${filter ? `${filter}` : ""}&page=${page}`,
      repoUrlState
    )
  );

export {
  getTotalCommits,
  getCommits,
  getCollaborators,
  getUserLocation,
  getTotalPullRequests,
};
