import React, { useEffect, useState } from 'react';

import './style.scss';

const TypeAnimation = (props) => {
  const {
    text,
    color,
    onDone
  } = props;

  const [animatedText, setAnimatedText] = useState('');

  useEffect(() => {
    let index = 0;
    let interval = null;

    const updateState = () => {
      if(text[index] === '\n') {
        setAnimatedText((prevState) => (prevState + "<br />"));
      } else {
        setAnimatedText((prevState) => (prevState + text[index]));
      }
      index += 1;
      if(index === text.length - 1) {
        clearInterval(interval);
        onDone();
      }
    };
    updateState();
    interval = setInterval(() => {
      updateState();
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  return (
    <div>
      <span style={{ color }} dangerouslySetInnerHTML={{ __html: animatedText }} className='type-animation'/>
      <span className="cursor">|</span>
    </div>
  );
};

export default TypeAnimation;
