import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage('repo-url');

// get commits info for the repo
const getCommits = async(filter) => {
  const result = await api.get(constructGitUrl(repoUrl, `commits?per_page=100&${filter ? `${filter}` : ''}`));
  return result;
};

const getCollab = async(filter) => {
  let result = await api.get(constructGitUrl(repoUrl, `contributors?per_page=100&${filter ? `${filter}` : ''}`));
  return result;
};

// get total commits infor for the repo
const getTotalCommits = async() => {
  const result = await getCommits();
  const resultLink = result.headers.get('Link').split(',');
  const lastPageLink = resultLink.find((resultItem) => resultItem.includes('rel="last"'));
  if(lastPageLink) {
    const lastPage = lastPageLink.match(/&page=(\d+)>/)[1];
    let lastPageCommits = await getCommits(`page=${lastPage}`);
    lastPageCommits = await lastPageCommits.json();
    return ({ length: lastPageCommits.length + 100 * (lastPage - 1), createdYear: lastPageCommits?.[lastPageCommits?.length - 1]?.commit?.author?.date });
  }
  return ({ length: result?.length, createdYear: result?.[result?.length - 1]?.commit?.author?.date  });
};

// getting collaborators info of the repo
const getCollaborators = async() => {
  const result = await getCollab();
  const resultLink = result.headers.get('Link').split(',');
  const lastPageLink = resultLink.find((resultItem) => resultItem.includes('rel="last"'));
  if(lastPageLink) {
    const lastPage = lastPageLink.match(/&page=(\d+)>/)[1];
    let lastPageCommits = await getCollab(`page=${lastPage}`);
    lastPageCommits = await lastPageCommits.json();
    return ({ length: lastPageCommits?.length + 100 * (lastPage - 1), });
  }
  return ({ length: result?.length });
};

export {
  getTotalCommits,
  getCommits,
  getCollaborators,
};