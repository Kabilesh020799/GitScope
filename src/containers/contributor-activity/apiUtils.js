import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage("repo-url");

const getAllCollaborators = async () => {
  const res = await api.get(constructGitUrl(repoUrl, `stats/contributors`));
  const data = await res.json();

  const allTimeData = data
    .map((contributor) => {
      const totalCommits = contributor.weeks.reduce((acc, w) => acc + w.c, 0);
      const totalAdditions = contributor.weeks.reduce((acc, w) => acc + w.a, 0);
      const totalDeletions = contributor.weeks.reduce((acc, w) => acc + w.d, 0);

      return {
        login: contributor.author?.login || "unknown",
        totalCommits,
        totalAdditions,
        totalDeletions,
        year: "all",
      };
    })
    .filter((c) => c.totalCommits > 0);

  return allTimeData;
};

const getAllCollaboratorsByYear = async (
  year,
  maxRetries = 5,
  delay = 2000
) => {
  const fetchStats = async (retries) => {
    const res = await api.get(constructGitUrl(repoUrl, `stats/contributors`));

    if (res.status === 202) {
      if (retries === 0)
        throw new Error("GitHub stats not ready after retries.");
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchStats(retries - 1);
    }

    const rawData = await res.json();
    return rawData || [];
  };

  const data = await fetchStats(maxRetries);

  const filteredData = data
    .map((contributor) => {
      const filteredWeeks = contributor.weeks.filter((week) => {
        const weekDate = new Date(week.w * 1000); // Convert UNIX timestamp to JS Date
        return weekDate.getFullYear() === year;
      });

      const totalCommits = filteredWeeks.reduce((acc, w) => acc + w.c, 0);
      const totalAdditions = filteredWeeks.reduce((acc, w) => acc + w.a, 0);
      const totalDeletions = filteredWeeks.reduce((acc, w) => acc + w.d, 0);

      return {
        login: contributor.author?.login || "unknown",
        totalCommits,
        totalAdditions,
        totalDeletions,
        year,
      };
    })
    .filter((c) => c.totalCommits > 0); // Exclude contributors with no commits in that year

  return filteredData;
};

export { getAllCollaborators, getAllCollaboratorsByYear };
