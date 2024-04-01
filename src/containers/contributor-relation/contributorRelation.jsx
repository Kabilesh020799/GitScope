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
      {pullRequests?.length ? <NetworkGraph pullRequests={pullRequests} /> : null}
    </div>
  );
};

export default ContributorRelation;
