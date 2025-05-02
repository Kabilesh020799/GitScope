import { extractRepoName, getHeaders } from "../../utils/common-utils";
import { ENDPOINTS } from "../../constants/api";

const addRepository = async (repoUrl, bearerToken) => {
  try {
    const response = await fetch(ENDPOINTS.repos, {
      method: "POST",
      headers: getHeaders(bearerToken),
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
  } catch (error) {
    console.error("Add repo failed", error);
    throw error;
  }
};

const fetchRepos = async (bearerToken) => {
  try {
    const res = await fetch(ENDPOINTS.repos, {
      headers: getHeaders(bearerToken),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch repos", err);
    return [];
  }
};

export { addRepository, fetchRepos };
