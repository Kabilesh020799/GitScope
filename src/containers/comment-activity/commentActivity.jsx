import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WordMap from "../../components/word-map";
import "./style.scss";
import YearSelector from "../../components/year-selector";
import BarChart from "../../components/bar-chart";
import { useNavigate } from "react-router-dom";
import { useCommentData } from "../../hooks/useCommentData";
import { useDispatch } from "react-redux";
import { clearComments } from "../dashboard/reducer";

const CommentActivity = () => {
  const { comments, createdYear } = useSelector((state) => state.commitReducer);
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useCommentData(year);

  const onClickDashboard = () => {
    navigate("/dashboard");
  };

  const onSelectYear = (selectedYear) => {
    dispatch(clearComments());
    setYear(selectedYear);
  };

  useEffect(() => {
    if (createdYear) {
      const firstYear = new Date(createdYear).getFullYear();
      const endYear = new Date().getFullYear();
      for (let year = firstYear; year <= endYear; year++) {
        if (!years.includes(year)) {
          setYears((prevState) => [...prevState, year]);
        }
      }
    }
    return () => setYears([]);
  }, [createdYear]);

  return (
    <div className="comment-activity">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "50px",
          marginBottom: "50px",
        }}
      >
        <h1 className="heading">Sentiment Analysis of the Commit Messages</h1>
        <button className="commit-activity-btn" onClick={onClickDashboard}>
          Go to Dashboard
        </button>
      </div>
      <div className="comment-activity-contents">
        <YearSelector
          years={years}
          selectedYear={year}
          onSelectYear={onSelectYear}
        />
        <div className="wordmaps">
          <div className="wordmaps-positive">
            {Object.keys(comments?.extractPositiveWords || {})?.length ? (
              <>
                <h1>Positive words used</h1>
                <WordMap
                  words={Object.keys(comments?.extractPositiveWords)}
                  classKey="positive"
                />
              </>
            ) : null}
          </div>
          <div className="wordmaps-negative">
            {Object.keys(comments?.extractNegativeWords || {})?.length ? (
              <>
                <h1>Negative words used</h1>
                <WordMap
                  words={Object.keys(comments?.extractNegativeWords)}
                  classKey="negative"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="barcharts">
        <h1>Some of the most frequently used</h1>
        <div className="barcharts-contents">
          <div className="barcharts-block">
            {Object.keys(comments?.extractPositiveWords || {})?.length ? (
              <>
                <span>Positive Words</span>
                <BarChart
                  data={comments?.extractPositiveWords}
                  classKey="positive"
                />
              </>
            ) : null}
          </div>
          <div className="barcharts-block">
            {Object.keys(comments?.extractNegativeWords || {})?.length ? (
              <>
                <span>Negative Words</span>
                <BarChart
                  data={comments?.extractNegativeWords}
                  classKey="negative"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentActivity;
