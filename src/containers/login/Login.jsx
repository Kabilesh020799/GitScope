import React, { useState } from 'react';
import LoginBackground from './components/login-background';
import TypeAnimation from '../../components/type-animation';

import api from '../../requests';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import { addCommits } from '../dashboard/reducer';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);
  const [repo, setRepo] = useState('');
  const navigate = useNavigate();

  //redux operations
  const dispatch = useDispatch();
  const { commits } = useSelector( state => state.commitReducer );

  const welcomeText = "Welcome to GitScope! \n Let\'s begin by entering your repository name";
console.log(commits);
  // user defined functions
  const onContinue = async() => {
    const repoList = repo.split('/');
    const user = repoList?.[3];
    const repoName = repoList?.[4];
    let result = await api.get(`${user}/${repoName}/commits`);
    if(result.length) {
      navigate('/dashboard');
      dispatch(addCommits({ data: result} ));
    }
  };

  return (
    <div className='login-container'>
      <div style={{ zIndex: 1, position: 'absolute' }}><LoginBackground /></div>
      <div style={{ zIndex: 10, position: 'relative' }} className='login-container-body'>
        <div className="text-container">
          <TypeAnimation text={welcomeText} color="#8193b2" onDone={ () => setIsTypeDone(true) }/>
            {
              isTypeDone ? (
                <div className="repo-name">
                  Enter the repository name*
                  <div className='repo-name-wrapper'>
                    <input
                      className='repo-name-wrapper-input'
                      onChange={(e) => setRepo(e.target.value)}
                      value={repo}
                    />
                    <button
                      className='repo-name-wrapper-btn'
                      onClick={onContinue}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ) : null
            }
        </div>
      </div>
    </div>
  );
};

export default Login;

