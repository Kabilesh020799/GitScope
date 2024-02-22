import React, { useEffect } from "react";
import './style.scss';
import { getCollaborators } from "../dashboard/apiUtils";
import { addCollaborators } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";

const ContributorActivity = () => {
  const dispatch = useDispatch();
  const { collaborators } = useSelector( state => state.commitReducer );

  useEffect(() => {
    if(!collaborators?.length) {
      getCollaborators()
      .then((res) => {
        if(res.status !== 403) {
          dispatch(addCollaborators({data: res}));
        }
      });
    }
  }, []);
  
  return (
    <div className="contributor-activity">

    </div>
  );
};

export default ContributorActivity;
