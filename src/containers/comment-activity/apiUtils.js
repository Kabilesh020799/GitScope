import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage('repo-url');

let positiveWords = await  fetch("/positive-words.txt");
positiveWords = await positiveWords.text();
positiveWords = positiveWords.split(/\s+/);
let negativeWords = await fetch("/negative-words.txt");
negativeWords = await negativeWords.text();
negativeWords = negativeWords.split(/\s+/);

const getAllComments = async(props) => {
  const {
    page,
    year,
    pW, 
    nW
  } = props;
  const pageNum = page || 1;
  const startDate = new Date(year, 0, 1);
  let extractPositiveWords = pW || {};
  let extractNegativeWords = nW || {};

  let result = await api.get(constructGitUrl(repoUrl, `issues/comments?per_page=100&since=${startDate.toISOString()}&page=${page}`));
  const resultLink = result.headers.get('Link').split(',');
  const nextPageLink = resultLink.find((resultItem) => resultItem.includes('rel="next"'));
  result = await result.json();
  const filteredResult = result?.filter((resultItem) => new Date(resultItem?.created_at).getFullYear() === year);
  filteredResult?.forEach((item) => {
    item?.body?.split(" ")?.filter((i) => positiveWords.includes(i)).forEach((word) => {
      extractPositiveWords[word] = (extractPositiveWords[word] || 0) + 1;
    });

    item?.body?.split(" ")?.filter((i) => negativeWords.includes(i)).forEach((word) => {
      extractNegativeWords[word] = (extractNegativeWords[word] || 0) + 1;
    });
  });
  if(new Date(filteredResult?.[filteredResult?.length - 1]?.created_at).getFullYear() === year) {
    if(nextPageLink) {
      const res = await getAllComments({ page: pageNum + 1, year, pW: extractNegativeWords, nW: extractPositiveWords});
      return ({
        extractPositiveWords: {...extractPositiveWords, ...(res?.extractPositiveWords || {})},
        extractNegativeWords: {...extractNegativeWords, ...(res?.extractNegativeWords || {})},
      });
    }
    return ({
      extractPositiveWords,
      extractNegativeWords
    });
  } else {
    return {};
  }
};

export {
  getAllComments,
};

