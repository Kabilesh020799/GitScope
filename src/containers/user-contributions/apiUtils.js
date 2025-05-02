import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";
import { fetchPullRequests } from "../contributor-relation/apiUtils";

const repoUrl = getStorage("repo-url");

const fetchCommitsByUser = async (repoUrl, username) => {
  const res = await api.get(
    constructGitUrl(repoUrl, `commits?author=${username}`)
  );
  const data = await res.json();
  return data.length;
};

const fetchPullRequestsByUser = async (username) => {
  const pulls = await fetchPullRequests();
  return pulls.filter((pr) => pr.user.login === username).length;
};

const fetchCodeReviewsByUser = async (repoUrl, username) => {
  const res = await api.get(constructGitUrl(repoUrl, `pulls/comments`));
  const comments = await res.json();
  return comments.filter((comment) => comment.user.login === username).length;
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
