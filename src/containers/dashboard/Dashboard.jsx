import React, { useEffect } from 'react';
import './style.scss';
import Card from '../../components/card';
import { useSelector, useDispatch } from 'react-redux';
import { addCollaborators, addCreatedDate, addTotalCommits } from '../dashboard/reducer';
import { getCollaborators, getTotalCommits } from './apiUtils';

const Dashboard = () => {
  const { collaborators, totalCommits } = useSelector( state => state.commitReducer );
  const dispatch = useDispatch();

  useEffect(() => {
    // calling the github APIs
    getTotalCommits()
      .then((res) => {
        dispatch(addTotalCommits({ data: res?.length }));
        dispatch(addCreatedDate({ data: res?.createdYear }));
      });
    getCollaborators()
      .then((res) => {
        if(res.status !== 403) {
          dispatch(addCollaborators({data: res}));
        }
      });
  }, []);

  return (
    <div className='dashboard'>
      <Card
        name="commits"
        value={totalCommits}
        path="/commit-activity"
      />
      <Card
        name="contributors"
        value={collaborators?.length}
      />
    </div>
  );
};

export default Dashboard;
