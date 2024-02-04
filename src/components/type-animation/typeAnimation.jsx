import React, { useEffect, useState } from 'react';

const TypeAnimation = (props) => {
  const {
    text,
  } = props;

  const [animatedText, setAnimatedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedText((prevState) => prevState + text[index]);
      index++;

      if(index === text.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div>{animatedText}</div>
  )
};

export default TypeAnimation;
