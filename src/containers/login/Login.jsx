import React, { useEffect, useState } from 'react';
import LoginBackground from './components/login-background';
import TypeAnimation from '../../components/type-animation';

import api from '../../requests';

import './style.scss';

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);
  const [repo, setRepo] = useState('');

  const welcomeText = "Welcome to GitScope! \n Let\'s begin by entering your repository name";

  useEffect(() => {
    const getResult = async() => {
      const result = await api.get('williamtroup/Heat.js/commits');
      console.log(result);
    };
    getResult();
  }, []);

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
                    <button className='repo-name-wrapper-btn'>Continue</button>
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

