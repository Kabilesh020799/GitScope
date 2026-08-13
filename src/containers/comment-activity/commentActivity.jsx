import React, { useCallback, useMemo, useState } from "react";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useCommentData(year);

  const onClickDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const onSelectYear = useCallback(
    (selectedYear) => {
      dispatch(clearComments());
      setYear(selectedYear);
    },
    [dispatch]
  );

  const availableYears = useMemo(() => {
    if (!createdYear) return [];
    const start = new Date(createdYear).getFullYear();
    const end = new Date().getFullYear();
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [createdYear]);

  const renderWordMapSection = (title, words, classKey) =>
    words?.length ? (
      <div className={`wordmaps-${classKey}`}>
        <h1>{title}</h1>
        <WordMap words={words} classKey={classKey} />
      </div>
    ) : null;

  const renderBarChartSection = (label, data, classKey) =>
    Object.keys(data || {}).length ? (
      <div className="barcharts-block">
        <span>{label}</span>
        <BarChart data={data} classKey={classKey} />
      </div>
    ) : null;

  return (
    <div className="comment-activity">
      <header className="comment-activity-header">
        <div><p className="analytics-eyebrow">Language signals</p>
        <h1 className="heading">Commit message sentiment</h1>
        <p>See the language patterns shaping collaboration and project momentum.</p></div>
        <button className="commit-activity-btn" onClick={onClickDashboard}>
          <span aria-hidden="true">←</span> Dashboard
        </button>
      </header>
      <div className="comment-activity-contents">
        <YearSelector
          years={availableYears}
          selectedYear={year}
          onSelectYear={onSelectYear}
        />
        <div className="wordmaps">
          {renderWordMapSection(
            "Positive words used",
            Object.keys(comments?.extractPositiveWords || {}),
            "positive"
          )}
          {renderWordMapSection(
            "Negative words used",
            Object.keys(comments?.extractNegativeWords || {}),
            "negative"
          )}
        </div>
      </div>
      <div className="barcharts">
        {(Object.keys(comments?.extractPositiveWords || {}).length > 0 ||
          Object.keys(comments?.extractNegativeWords || {}).length > 0) && (
          <h2>Most frequently used words</h2>
        )}
        <div className="barcharts-contents">
          {renderBarChartSection(
            "Positive Words",
            comments?.extractPositiveWords,
            "positive"
          )}
          {renderBarChartSection(
            "Negative Words",
            comments?.extractNegativeWords,
            "negative"
          )}
        </div>
        {!Object.keys(comments?.extractPositiveWords || {}).length && !Object.keys(comments?.extractNegativeWords || {}).length && (
          <div className="comment-empty"><strong>No sentiment data yet</strong><span>No qualifying commit messages were found for {year}.</span></div>
        )}
      </div>
    </div>
  );
};

export default CommentActivity;
