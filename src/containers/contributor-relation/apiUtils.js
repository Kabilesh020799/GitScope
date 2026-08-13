import api from "../../requests";
import { constructGitUrl, getStorage, mapWithConcurrency } from "../../utils/common-utils";

const fetchAllPullRequests = async (
  repoUrl,
  filter = "",
  page = 1,
  accumulator = []
) => {
  const url = constructGitUrl(
    repoUrl,
    `pulls?per_page=100&${filter ? `${filter}` : ""}&page=${page}`
  );
  const response = await api.get(url);
  const linkHeader = response.headers.get("Link");
  const nextPage = linkHeader?.includes('rel="next"');
  const data = await response.json();
  const all = [...accumulator, ...data];

  return nextPage ? fetchAllPullRequests(repoUrl, filter, page + 1, all) : all;
};

const enrichPullRequests = async (repoUrl, pullRequests) => {
  return mapWithConcurrency(
    pullRequests,
    async (pr) => {
      try {
        const reviewsRes = await api.get(
          constructGitUrl(repoUrl, `pulls/${pr.number}/reviews`)
        );
        const reviews = await reviewsRes.json();

        return {
          ...pr,
          reviews,
          pullUrl: `${repoUrl}/pull/${pr?.number}`,
        };
      } catch (err) {
        console.error(`Failed to fetch reviews for PR #${pr.number}`, err);
        return { ...pr, reviews: [], pullUrl: `${repoUrl}/pull/${pr?.number}` };
      }
    },
    6
  );
};

const fetchPullRequests = async (filter, repoUrlParam) => {
  const repoUrl = repoUrlParam || getStorage("repo-url");
  const rawPulls = await fetchAllPullRequests(repoUrl, filter);
  const enriched = await enrichPullRequests(repoUrl, rawPulls);
  return enriched;
};

export { fetchPullRequests };
