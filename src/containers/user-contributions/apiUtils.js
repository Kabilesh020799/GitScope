import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";
import { fetchPullRequests } from "../contributor-relation/apiUtils";

const repoUrl = getStorage('repo-url');

const fetchGitHubData = async(username) => {
  // Fetch commits by the user
  const commitsResponse = await api.get(constructGitUrl(repoUrl, `commits?author=${username}`));
  const commitsData = await commitsResponse.json();

  // Fetch pull requests by the user
  const pullsResponse = await fetchPullRequests();
  const pullsData = pullsResponse.filter(pr => pr.user.login === username);

  // Assuming code reviews are pull request comments by the user
  const reviewsResponse = await api.get(constructGitUrl(repoUrl, `pulls/comments`));
  const reviewsData = await reviewsResponse.json().then(comments => comments.filter(comment => comment.user.login === username));

  return {
    commits: commitsData.length,
    pullRequests: pullsData.length,
    codeReviews: reviewsData.length
  };
};

export {
  fetchGitHubData,
};