import React, { useEffect } from "react";
import { fetchPullRequests } from "./apiUtils";
import NetworkGraph from "../../components/network-graph/networkGraph";
import { useDispatch, useSelector } from "react-redux";
import { setPullRequests } from "../dashboard/reducer";
import './style.scss';

const ContributorRelation = () => {
  const { 
    pullRequests,
  } = useSelector( state => state.commitReducer );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPullRequests()
      .then((res) => {
        dispatch(setPullRequests({ data: res }));
      });
  }, []);

  return(
    <div className="contributor-relation">
      <h1 className="contributor-relation-heading">Some Relations between the Collaborators with the active pullRequests</h1>
      {pullRequests?.length ? <NetworkGraph pullRequests={pullRequests} /> : null}
    </div>
  );
};

export default ContributorRelation;
