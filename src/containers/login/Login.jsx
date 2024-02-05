import React, { useState } from 'react';
import LoginBackground from './components/login-background';
import TypeAnimation from '../../components/type-animation';

import './style.scss';

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);

  const welcomeText = "Welcome to GitScope! \n Let\'s begin by entering your repository name";

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
                </div>
              ) : null
            }
        </div>
      </div>
    </div>
  );
}

export default Login;

