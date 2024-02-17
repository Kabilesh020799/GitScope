import React, { useEffect } from 'react';
import './style.scss';
import Card from '../../components/card';
import { useSelector, useDispatch } from 'react-redux';
import { constructGitUrl, getStorage } from '../../utils/common-utils';
import { addCollaborators, addCommits } from '../dashboard/reducer';
import api from '../../requests';

const Dashboard = () => {
  const { commits, collaborators } = useSelector( state => state.commitReducer );
  
  const dispatch = useDispatch();
  const repoUrl = getStorage('repo-url');

  // getting commits of the repo from github
  const getCommits = async() => {
    let result = await api.get(constructGitUrl(repoUrl, 'commits'));
    if(result.length) {
      dispatch(addCommits({data: result}));
    }
  };

  // getting collaborators info of the repo
  const getCollaborators = async() => {
    let result = await api.get(constructGitUrl(repoUrl, 'collaborators'));
    if(result.length) {
      dispatch(addCollaborators({data: result}));
    }
  };

  useEffect(() => {
    // calling the github API
    getCommits();
    getCollaborators();
  }, []);

  return (
    <div className='dashboard'>
      <Card
        name="commits"
        value={commits?.length}
      />
      <Card
        name="contributors"
        value={collaborators?.length}
      />
    </div>
  );
};

export default Dashboard;
