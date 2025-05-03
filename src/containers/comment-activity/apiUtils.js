import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

let positiveWords = [];
let negativeWords = [];

const loadWordLists = async () => {
  if (!positiveWords.length || !negativeWords.length) {
    const posRes = await fetch("/positive-words.txt");
    positiveWords = (await posRes.text()).split(/\s+/).filter(Boolean);

    const negRes = await fetch("/negative-words.txt");
    negativeWords = (await negRes.text()).split(/\s+/).filter(Boolean);
  }
};

const extractWordsBySentiment = (text, sentimentList) => {
  const countMap = {};
  if (!text) return countMap;

  text.split(/\s+/).forEach((word) => {
    if (sentimentList.includes(word)) {
      countMap[word] = (countMap[word] || 0) + 1;
    }
  });

  return countMap;
};

const mergeWordCounts = (base, additional) => {
  for (const [word, count] of Object.entries(additional)) {
    base[word] = (base[word] || 0) + count;
  }
  return base;
};

const parseTotalPages = (linkHeader) => {
  const lastLink = linkHeader
    .split(",")
    .find((link) => link.includes('rel="last"'));
  if (!lastLink) return 1;

  const match = lastLink.match(/&page=(\d+)>/);
  return match ? parseInt(match[1], 10) : 1;
};

const fetchCommentsPage = async (repoUrl, page, since) => {
  try {
    const res = await api.get(
      constructGitUrl(
        repoUrl,
        `issues/comments?per_page=100&since=${since}&page=${page}`
      )
    );
    return res.json();
  } catch (err) {
    return [];
  }
};

const getAllComments = async ({ year }) => {
  await loadWordLists();
  const repoUrl = getStorage("repo-url");
  const since = new Date(year, 0, 1).toISOString();

  const firstRes = await api.get(
    constructGitUrl(
      repoUrl,
      `issues/comments?per_page=100&since=${since}&page=1`
    )
  );
  const firstComments = await firstRes.json();
  const totalPages = parseTotalPages(firstRes.headers.get("Link") || "");

  let allComments = [...firstComments];

  if (totalPages > 1) {
    const requests = Array.from({ length: totalPages - 1 }, (_, i) =>
      fetchCommentsPage(repoUrl, i + 2, since)
    );
    const pages = await Promise.all(requests);
    pages.forEach((pageData) => allComments.push(...pageData));
  }

  const filtered = allComments.filter(
    (item) => new Date(item?.created_at).getFullYear() === year
  );

  const pW = {};
  const nW = {};

  filtered.forEach(({ body }) => {
    mergeWordCounts(pW, extractWordsBySentiment(body, positiveWords));
    mergeWordCounts(nW, extractWordsBySentiment(body, negativeWords));
  });

  return {
    extractPositiveWords: pW,
    extractNegativeWords: nW,
  };
};

export { getAllComments };
