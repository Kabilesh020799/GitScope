import React, { useState } from 'react';
import LoginBackground from './components/login-background';
import TypeAnimation from '../../components/type-animation';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import { setStorage } from '../../utils/common-utils';

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);
  const [repo, setRepo] = useState('');
  const navigate = useNavigate();

  const welcomeText = "Welcome to GitScope! \n Let\'s begin by entering your repository name";

  // user defined functions
  const onContinue = async() => {
    if(repo) {
      setStorage('repo-url', repo);
      navigate('/dashboard');
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

