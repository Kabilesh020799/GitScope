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
      console.log(selectedYear);
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
          <h1>Some of the most frequently used</h1>
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
      </div>
    </div>
  );
};

export default CommentActivity;
