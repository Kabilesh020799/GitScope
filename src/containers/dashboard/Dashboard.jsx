import React, { useEffect } from 'react';
import './style.scss';
import Card from '../../components/card';
import { useSelector, useDispatch } from 'react-redux';
import { constructGitUrl, getStorage } from '../../utils/common-utils';
import { addCommits } from '../dashboard/reducer';
import api from '../../requests';

const Dashboard = () => {
  const { commits } = useSelector( state => state.commitReducer );
  const dispatch = useDispatch();

  useEffect(() => {
    // getting commits of the repo from github
    const getCommits = async() => {
      const repoUrl = getStorage('repo-url');
      let result = await api.get(constructGitUrl(repoUrl, 'commits'));
      if(result.length) {
        dispatch(addCommits({data: result}));
      }
    };
    getCommits();
  }, []);

  return (
    <div className='dashboard'>
      <Card
        name="commits"
        value={commits?.length}
      />
    </div>
  );
};

export default Dashboard;
