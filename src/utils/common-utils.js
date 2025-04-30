// write to local storage
const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const constructGitUrl = (repoUrl, key) => {
  if (!repoUrl) {
    console.error("Repo URL is not available!");
    return "";
  }
  const repoList = repoUrl.split("/");
  const user = repoList?.[3];
  const repoName = repoList?.[4];
  return `${user}/${repoName}/${key ? key : ""}`;
};

const extractRepoName = (url) => {
  const match = url.match(/github\.com\/[^\/]+\/([^\/]+)/);
  if (!match) return "";
  const name = match[1];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export { setStorage, getStorage, constructGitUrl, extractRepoName };
