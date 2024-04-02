import React, { useEffect, useState } from "react";
import { fetchPullRequests } from "./apiUtils";
import NetworkGraph from "../../components/network-graph/networkGraph";
import { useDispatch, useSelector } from "react-redux";
import { setPullRequests } from "../dashboard/reducer";
import './style.scss';
import { CircularProgress } from "@mui/material";

const ContributorRelation = () => {
  const { 
    pullRequests,
  } = useSelector( state => state.commitReducer );
  const dispatch = useDispatch();
  const [highlightedPrId, setHighlightedPrId] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPullRequests()
      .then((res) => {
        dispatch(setPullRequests({ data: res }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return(
    <div className="contributor-relation">
      <h1 className="contributor-relation-heading">Some Relations between the Collaborators with the active pullRequests</h1>
      <div className="contributor-relation-content">
        <span className="content-head">Please specify the pullRequest id you want to check</span>
        <input
          className="content-input"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              setHighlightedPrId(inputValue);
            }
          }}
        />
      </div>
      {
        loading ? (
          <div style={{ height: 'calc(100% - 100px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          pullRequests?.length ? <NetworkGraph pullRequests={pullRequests} highlightedPrId={highlightedPrId} /> : null
        )
      }
    </div>
  );
};

export default ContributorRelation;
