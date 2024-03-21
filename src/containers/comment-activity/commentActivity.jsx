import React, { useEffect, useState } from 'react';
import { getAllComments } from './apiUtils';
import { useDispatch, useSelector } from 'react-redux';
import { addCreatedDate, clearLoading, setComments, setLoading } from '../dashboard/reducer';
import WordMap from '../../components/word-map';
import './style.scss';
import YearSelector from '../../components/year-selector';
import { getTotalCommits } from '../dashboard/apiUtils';

const CommentActivity = () => {
  const dispatch = useDispatch();
  const { comments, createdYear } = useSelector( state => state.commitReducer );
  const [year, setYear] = useState(2023);
  const [years, setYears] = useState([]);

  useEffect(() => {
    dispatch(setLoading());
    getAllComments({ year, })
      .then((res) => {
        dispatch(setComments({ data: res }));
      })
      .finally(() => {
        dispatch(clearLoading());
      })
      .catch(() => {
        dispatch(clearLoading());
      });
      
    getTotalCommits()
    .then((res) => {
      dispatch(addCreatedDate({ data: res.createdYear }));
    });
  }, [year]);
  
  useEffect(() => {
    if(createdYear) {
      const firstYear = new Date(createdYear).getFullYear();
      const endYear = new Date().getFullYear();
      for(let year = firstYear;year <= endYear;year++) {
        if(!years.includes(year)) { 
          setYears((prevState) => ([...prevState, year]));
        }
      }
    }
    return () => setYears([]);
  }, [createdYear]);

  return (
    <div className='comment-activity'>
      <div className="heading">Sentiment Analysis of the Commit Messages</div>
      <div className="comment-activity-contents">
        <YearSelector
            years={years}
            selectedYear={year}
            onSelectYear={(selYear) => setYear(selYear)}
          />
        <div className="wordmaps">
          <div className="wordmaps-positive">
            {Object.keys(comments?.extractPositiveWords || {})?.length ? (
              <>
                <h1>Positive words used</h1>
                <WordMap words={Object.keys(comments?.extractPositiveWords)} classKey="positive" />
              </>
            ) : null}
          </div>
          <div className="wordmaps-negative">
            {Object.keys(comments?.extractNegativeWords || {})?.length ? (
              <>
                <h1>Negative words used</h1>
                <WordMap words={Object.keys(comments?.extractNegativeWords)} classKey="negative" />
              </>
            ) : null }
          </div>
        </div>
        <div className="barcharts">
          <div className="barchart-positive">
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentActivity;
