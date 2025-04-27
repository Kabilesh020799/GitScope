import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage("repo-url");

// get commits info for the repo
const getAllCommits = async (filter) => {
  const firstResponse = await api.get(
    constructGitUrl(
      repoUrl,
      `commits?per_page=100&${filter ? `${filter}` : ""}&page=1`
    )
  );
  const firstPageData = await firstResponse.json();
  const linkHeader = firstResponse.headers.get("Link");
  if (!linkHeader) {
    return [...firstPageData];
  }
  const links = linkHeader.split(",");
  const lastPageLink = links.find((link) => link.includes('rel="last"'));
  let totalPages = 1;
  if (lastPageLink) {
    const match = lastPageLink.match(/&page=(\d+)>/);
    if (match) {
      totalPages = parseInt(match[1], 10);
    }
  }

  const promises = [];
  for (let page = 2; page <= totalPages; page++) {
    promises.push(
      api
        .get(
          constructGitUrl(
            repoUrl,
            `commits?per_page=100&${filter ? `${filter}` : ""}&page=${page}`
          )
        )
        .then(async (res) => {
          if (res.ok) {
            return await res.json();
          } else {
            console.error(`Error fetching page ${page}`, res.status);
            return [];
          }
        })
    );
  }

  // parallel processing
  const remainingPagesData = await Promise.all(promises);
  const allCommits = [firstPageData, ...remainingPagesData].flat();

  return allCommits;
};

export { getAllCommits };
