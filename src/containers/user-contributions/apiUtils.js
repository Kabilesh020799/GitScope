import api from "../../requests";
import { constructGitUrl, getLinkPage, getStorage } from "../../utils/common-utils";
import { fetchPullRequests } from "../contributor-relation/apiUtils";

const countPages = async (repoUrl, endpoint) => {
  let page = 1;
  let count = 0;
  while (page) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const res = await api.get(
      constructGitUrl(repoUrl, `${endpoint}${separator}per_page=100&page=${page}`)
    );
    count += (await res.json()).length;
    page = getLinkPage(res.headers.get("Link"), "next");
  }
  return count;
};

const fetchCommitsByUser = (repoUrl, username) =>
  countPages(repoUrl, `commits?author=${encodeURIComponent(username)}`);

const fetchPullRequestsByUser = async (username) => {
  const pulls = await fetchPullRequests();
  return pulls.filter((pr) => pr.user.login === username).length;
};

const fetchCodeReviewsByUser = async (repoUrl, username) => {
  let page = 1;
  let count = 0;
  while (page) {
    const res = await api.get(
      constructGitUrl(repoUrl, `pulls/comments?per_page=100&page=${page}`)
    );
    const comments = await res.json();
    count += comments.filter((comment) => comment.user.login === username).length;
    page = getLinkPage(res.headers.get("Link"), "next");
  }
  return count;
};

const fetchGitHubData = async (username) => {
  const repoUrl = getStorage("repo-url");

  const [commits, pullRequests, codeReviews] = await Promise.all([
    fetchCommitsByUser(repoUrl, username),
    fetchPullRequestsByUser(username),
    fetchCodeReviewsByUser(repoUrl, username),
  ]);

  return { commits, pullRequests, codeReviews };
};

export { fetchGitHubData };
