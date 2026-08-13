import React, { useEffect, useState } from "react";

import "./style.scss";

const noop = () => {};

const TypeAnimation = (props) => {
  const { text = "", color = "#000", onDone = noop } = props;

  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    let index = 0;
    setAnimatedText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        const nextCharacter = text[index];
        setAnimatedText((prev) => prev + nextCharacter);
        index += 1;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, onDone]);

  const renderContent = () => {
    return [...animatedText].map((char, i) =>
      char === "\n" ? <br key={i} /> : <span key={i}>{char}</span>
    );
  };

  return (
    <div aria-label={text}>
      <span style={{ color }} className="type-animation">
        <span aria-hidden="true">{renderContent()}</span>
      </span>
      <span className="cursor" aria-hidden="true">|</span>
    </div>
  );
};

export default TypeAnimation;
