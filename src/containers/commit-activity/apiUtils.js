import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

// get commits info for the repo
const getAllCommits = async (filter, repoUrlParam) => {
  const resolvedRepoUrl = repoUrlParam || getStorage("repo-url");
  const baseUrl = `commits?per_page=100&${filter}&page=`;

  const firstResponse = await api.get(
    constructGitUrl(resolvedRepoUrl, `${baseUrl}1`)
  );
  const firstPageData = await firstResponse.json();
  const linkHeader = firstResponse.headers.get("Link");
  if (!linkHeader) {
    return [...firstPageData];
  }

  const lastPageMatch = linkHeader
    .split(",")
    .find((link) => link.includes('rel="last"'))
    ?.match(/&page=(\d+)>/);
  const totalPages = lastPageMatch
    ? Math.min(parseInt(lastPageMatch[1], 10), 50)
    : 1;

  const pageFetches = Array.from({ length: totalPages - 1 }, (_, i) => {
    const page = i + 2;
    return api
      .get(constructGitUrl(resolvedRepoUrl, `${baseUrl}${page}`))
      .then((res) => (res.ok ? res.json() : []));
  });

  const remainingPages = await Promise.all(pageFetches);
  return [firstPageData, ...remainingPages].flat();
};

export { getAllCommits };
