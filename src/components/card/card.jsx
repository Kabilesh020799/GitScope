import React from 'react';
import './style.scss';

const Card = (props) => {
  const {
    className,
    name,
    value,
  } = props;

  return (
    <div className={`card ${className ? className : ''}`}>
      <div className="card-name">{name}</div>
      <div className="card-value">{value}</div>
    </div>
  );
};

export default Card;
