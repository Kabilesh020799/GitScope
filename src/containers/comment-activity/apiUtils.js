import api from "../../requests";
import { constructGitUrl, getStorage } from "../../utils/common-utils";

const repoUrl = getStorage('repo-url');

const getAllComments = async(props) => {
  const {
    page,
    year,
  } = props;
  const pageNum = page || 1;
  let result = await api.get(constructGitUrl(repoUrl, `issues/comments?per_page=100&page=${page}`));
  const resultLink = result.headers.get('Link').split(',');
  const nextPageLink = resultLink.find((resultItem) => resultItem.includes('rel="next"'));
  result = await result.json();
  const filteredResult = result?.filter((resultItem) => new Date(resultItem?.created_at).getFullYear() === year);
  if(new Date(filteredResult?.[filteredResult?.length - 1]?.created_at).getFullYear() === year) {
    if(nextPageLink) {
      return [...filteredResult, ...await getAllComments({ page: pageNum + 1, year})];
    }
    return [...filteredResult];
  } else {
    return [];
  }
};

const getAllWords = async(positive) => {
  let txtWords = await  fetch( positive ? "/positive-words.txt" : "/negative-words.txt");
  txtWords = await txtWords.text();
  return txtWords.split(/\s+/);
};

export {
  getAllComments,
  getAllWords,
};

