import React, { useEffect, useState } from 'react';
import { getAllComments, getAllWords } from './apiUtils';
import { useDispatch, useSelector } from 'react-redux';
import { clearLoading, setComments, setLoading } from '../dashboard/reducer';
import WordMap from '../../components/word-map';
import './style.scss';

const CommentActivity = () => {
  const dispatch = useDispatch();
  const { comments } = useSelector( state => state.commitReducer );
  const [positiveWords, setPostiveWords] = useState([]);
  const [negativeWords, setNegativeWords] = useState([]);
  const [extractedPostiveWords, setExtractedPositiveWords] = useState([]);
  const [extractedNegativeWords, setExtractedNegativeWords] = useState([]);

  useEffect(() => {
    comments.forEach((comment) => {
      setExtractedPositiveWords((prev) => [...prev, ...(comment?.body?.split(" ")?.filter((commentBody) => positiveWords.includes(commentBody)) || [])]);
      setExtractedNegativeWords((prev) => [...prev, ...(comment?.body?.split(" ")?.filter((commentBody) => negativeWords.includes(commentBody)) || [])]);
    });
  }, [comments, negativeWords, positiveWords]);

  useEffect(() => {
    dispatch(setLoading());
    getAllComments({ year: 2013, })
      .then((res) => {
        dispatch(setComments({ data: res }));
      })
      .finally(() => {
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });
      
    // positive words
    dispatch(setLoading());
    getAllWords(true)
      .then((res) => {
        setPostiveWords(res);
      })
      .finally(() => {
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });

    // negative words
    dispatch(setLoading());
    getAllWords(false)
      .then((res) => {
        setNegativeWords(res);
      })
      .finally(() => {
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });
  }, []);

  return (
    <div className='comment-activity'>
      <div className="heading">Sentiment Analysis of the Commit Messages</div>
      <div className="wordmaps">
        <div className="wordmaps-positive">
          {extractedPostiveWords?.length ? (
            <>
              <h1>Positive words used</h1>
              <WordMap words={[...new Set(extractedPostiveWords)]} classKey="positive" />
            </>
          ) : null}
        </div>
        <div className="wordmaps-negative">
          {extractedNegativeWords?.length ? (
            <>
              <h1>Negative words used</h1>
              <WordMap words={[...new Set(extractedNegativeWords)]} classKey="negative" />
            </>
          ) : null }
        </div>
      </div>
      <div className="barcharts">
        <div className="barchart-positive">
        </div>
      </div>
    </div>
  );
};

export default CommentActivity;
