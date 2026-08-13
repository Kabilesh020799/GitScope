// write to local storage
const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const constructGitUrl = (repoUrl, key) => {
  if (!repoUrl) {
    console.error("Repo URL is not available!");
    return "";
  }
  try {
    const parsed = new URL(repoUrl);
    if (parsed.hostname !== "github.com") return "";
    const [user, rawRepoName] = parsed.pathname.split("/").filter(Boolean);
    const repoName = rawRepoName?.replace(/\.git$/, "");
    if (!user || !repoName) return "";
    return `${encodeURIComponent(user)}/${encodeURIComponent(repoName)}/${key || ""}`;
  } catch {
    return "";
  }
};

const extractRepoName = (url) => {
  const match = url.match(/github\.com\/[^\/]+\/([^\/]+)/);
  if (!match) return "";
  const name = match[1];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getHeaders = (bearerToken) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${bearerToken}`,
});

const getLinkPage = (linkHeader, relation) => {
  const link = (linkHeader || "")
    .split(",")
    .find((item) => item.includes(`rel="${relation}"`));
  const match = link?.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : null;
};

const mapWithConcurrency = async (items, worker, limit = 6) => {
  const results = new Array(items.length);
  let next = 0;
  const run = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
};

export {
  setStorage,
  getStorage,
  constructGitUrl,
  extractRepoName,
  getHeaders,
  getLinkPage,
  mapWithConcurrency,
};
