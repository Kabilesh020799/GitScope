import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";


const repoUrl = getStorage('repo-url');

const getAllCollaborators = async() => {
  let result = await api.get(constructGitUrl(repoUrl, `stats/contributors`));
  result = await result.json();
  return [ ...result ];
};


export {
  getAllCollaborators,
};
