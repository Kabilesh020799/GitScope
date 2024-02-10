import React, { useState } from 'react';
import LoginBackground from './components/login-background';
import TypeAnimation from '../../components/type-animation';

import './style.scss';

const Login = () => {
  const [isTypeDone, setIsTypeDone] = useState(false);
  const [email, setEmail] = useState('');

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
                  <div className='repo-name-wrapper'>
                    <input
                      className='repo-name-wrapper-input'
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
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
}

export default Login;

