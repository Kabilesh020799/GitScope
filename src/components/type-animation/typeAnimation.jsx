import React, { useEffect, useState } from "react";

import "./style.scss";

const TypeAnimation = (props) => {
  const { text = "", color = "#000", onDone = () => {} } = props;

  const [animatedText, setAnimatedText] = useState([]);

  useEffect(() => {
    let index = 0;
    setAnimatedText([text[0]]);

    const interval = setInterval(() => {
      if (index < text.length) {
        setAnimatedText((prev) => [...prev, text[index]]);
        index++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, onDone]);

  const renderContent = () => {
    return animatedText.map((char, i) =>
      char === "\n" ? <br key={i} /> : <span key={i}>{char}</span>
    );
  };

  return (
    <div>
      <span style={{ color }} className="type-animation">
        {renderContent()}
      </span>
      <span className="cursor">|</span>
    </div>
  );
};

export default TypeAnimation;
