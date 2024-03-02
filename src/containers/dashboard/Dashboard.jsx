import React, { useEffect } from 'react';
import Card from '../../components/card';
import { useSelector, useDispatch } from 'react-redux';
import { addCreatedDate, addTotalCommits, addTotalCollaborators } from '../dashboard/reducer';
import { getCollaborators, getTotalCommits } from './apiUtils';
import './style.scss';

const Dashboard = () => {
  const { totalCollaborators, totalCommits } = useSelector( state => state.commitReducer );
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
          console.log({data: res?.length});
          dispatch(addTotalCollaborators({data: res?.length}));
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
        value={totalCollaborators}
        path="/contributor-activity"
      />
    </div>
  );
};

export default Dashboard;
