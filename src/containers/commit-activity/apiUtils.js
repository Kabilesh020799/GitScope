import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage('repo-url');

// get commits info for the repo
const getAllCommits = async(filter, page=1) => {
  let result = await api.get(constructGitUrl(repoUrl, `commits?per_page=100&${filter ? `${filter}` : ''}&page=${page}`));
  const resultLink = result.headers.get('Link').split(',');
  const nextPageLink = resultLink.find((resultItem) => resultItem.includes('rel="next"'));
  result = await result.json();
  if(nextPageLink) {
    return [...result, ...await getAllCommits(filter, page + 1)];
  }
  return [...result];
};

export {
  getAllCommits,
};
