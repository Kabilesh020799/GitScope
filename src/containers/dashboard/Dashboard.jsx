import React, { useEffect } from 'react';
import Card from '../../components/card';
import { useSelector, useDispatch } from 'react-redux';
import { addCreatedDate, addTotalCommits, addTotalCollaborators, setPulls } from '../dashboard/reducer';
import { getCollaborators, getTotalCommits, getTotalPullRequests } from './apiUtils';
import './style.scss';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const { 
    totalCollaborators,
    totalCommits,
    totalPulls
  } = useSelector( state => state.commitReducer );
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
          dispatch(addTotalCollaborators({data: res?.length}));
        }
      });
    getTotalPullRequests()
      .then((res) => {
        dispatch(setPulls({ data: res?.length }));
      });
  }, []);

  return (
    <div className='dashboard'>
      <div className='dashboard-cards'>
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
        <Card
          name="Active Pulls"
          value={totalPulls}
          path="/contributor-relation"
        />
      </div>
      <div className="dashboard-contents">
        <div className="row-card">
          <span>Look into the Sentimental Analysis of the comments</span>
          <NavLink
            style={{ display: 'flex', gap: '10px', justifyContent: "center", alignItems: 'center', color: 'blue', textDecoration: 'none' }}
            to={'/comment-activity'}
          >
            Go to Comment Analysis
            <i className="fa-solid fa-arrow-right"></i>
          </NavLink>
        </div>
        <div className="row-card">
          <span>Look at the individual user contribution</span>
          <NavLink
            style={{ display: 'flex', gap: '10px', justifyContent: "center", alignItems: 'center', color: 'blue', textDecoration: 'none' }}
            to={'/user-contribution'}
          >
            Go to User Contribution Analysis
            <i className="fa-solid fa-arrow-right"></i>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
