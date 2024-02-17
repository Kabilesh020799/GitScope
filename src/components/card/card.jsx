import React from 'react';
import './style.scss';
import { NavLink } from 'react-router-dom';

const Card = (props) => {
  const {
    className,
    name,
    value,
    path
  } = props;

  return (
    <div className={`card ${className ? className : ''}`}>
      <div className="card-name">{name}</div>
      <div className="card-value">{value}</div>
      <NavLink to={path} className="card-link">
        <span>See detailed view</span>
        <i className="fa-solid fa-arrow-right"></i>
      </NavLink>
    </div>
  );
};

export default Card;
