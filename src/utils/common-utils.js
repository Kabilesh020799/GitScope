// write to local storage
const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const constructGitUrl = (repoUrl, key) => {
  console.log(repoUrl);
  const repoList = repoUrl.split("/");
  const user = repoList?.[3];
  const repoName = repoList?.[4];
  return `${user}/${repoName}/${key ? key : ""}`;
};

export { setStorage, getStorage, constructGitUrl };
