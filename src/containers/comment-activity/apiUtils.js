import api from "../../requests";
import { constructGitUrl, getLinkPage, getStorage, mapWithConcurrency } from "../../utils/common-utils";

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

const getAllComments = async ({ year, repoUrl: repoUrlParam }) => {
  await loadWordLists();
  const repoUrl = repoUrlParam || getStorage("repo-url");
  const since = new Date(year, 0, 1).toISOString();

  const firstRes = await api.get(
    constructGitUrl(
      repoUrl,
      `issues/comments?per_page=100&since=${since}&page=1`
    )
  );
  const firstComments = await firstRes.json();
  const totalPages = getLinkPage(firstRes.headers.get("Link"), "last") || 1;

  let allComments = [...firstComments];

  if (totalPages > 1) {
    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const pages = await mapWithConcurrency(
      pageNumbers,
      (page) => fetchCommentsPage(repoUrl, page, since),
      6
    );
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
