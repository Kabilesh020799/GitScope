import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage('repo-url');

const fetchPullRequests = async(filter, page=1) => {
  let result = await api.get(constructGitUrl(repoUrl, `pulls?per_page=100&${filter ? `${filter}` : ''}&page=${page}`));
  const resultLink = result.headers.get('Link').split(',');
  const nextPageLink = resultLink.find((resultItem) => resultItem.includes('rel="next"'));
  result = await result.json();
  for (let pr of result) {
    const reviewsResponse = await api.get(constructGitUrl(repoUrl, `pulls/${pr.number}/reviews`));
    const reviews = await reviewsResponse.json();
    pr.reviews = reviews;
    pr.pullUrl = `${repoUrl}/pull/${pr?.number}`;
}
  if(nextPageLink) {
    return [...result, ...await fetchPullRequests(filter, page + 1)];
  }
  return [...result];
};

export {
  fetchPullRequests,
};
