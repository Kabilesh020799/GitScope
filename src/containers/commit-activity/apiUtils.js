import api from "../../requests";
import { constructGitUrl, getLinkPage, getStorage, mapWithConcurrency } from "../../utils/common-utils";

// get commits info for the repo
const getAllCommits = async (filter, repoUrlParam) => {
  const resolvedRepoUrl = repoUrlParam || getStorage("repo-url");
  const baseUrl = `commits?per_page=100${filter ? `&${filter}` : ""}&page=`;

  const firstResponse = await api.get(
    constructGitUrl(resolvedRepoUrl, `${baseUrl}1`)
  );
  const firstPageData = await firstResponse.json();
  const linkHeader = firstResponse.headers.get("Link");
  if (!linkHeader) {
    return [...firstPageData];
  }

  const totalPages = getLinkPage(linkHeader, "last") || 1;

  const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  const remainingPages = await mapWithConcurrency(pages, async (page) => {
    const res = await api.get(constructGitUrl(resolvedRepoUrl, `${baseUrl}${page}`));
    return res.json();
  }, 6);
  return [firstPageData, ...remainingPages].flat();
};

export { getAllCommits };
