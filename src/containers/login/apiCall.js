import { extractRepoName } from "../../utils/common-utils";

const API_URL = process.env.REACT_APP_API_URL;

const addRepository = async (repoUrl, bearerToken) => {
  const response = await fetch(`${API_URL}/api/repos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify({
      name: extractRepoName(repoUrl),
      url: repoUrl,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to add repository");
  }

  const data = await response.json();
  return data;
};

const fetchRepos = async (bearerToken) => {
  try {
    const res = await fetch(`${API_URL}/api/repos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch repos", err);
    return [];
  }
};

export { addRepository, fetchRepos };
