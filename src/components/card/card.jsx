import React from "react";
import "./style.scss";
import { NavLink } from "react-router-dom";
import { Skeleton } from "@mui/material";

const Card = ({ className, name, value, path, loading }) => {
  return (
    <div className={`card ${className || ""}`}>
      <div className="card-content">
        <div className="card-name">
          {name || <Skeleton variant="text" width={120} height={24} />}
        </div>

        <div className="card-value">
          {loading ? (
            <Skeleton variant="text" width={80} height={40} animation="wave" />
          ) : (
            <span>{value}</span>
          )}
        </div>
      </div>

      <NavLink to={path} className="card-link">
        <span>See detailed view</span>
        <i className="fa-solid fa-arrow-right"></i>
      </NavLink>
    </div>
  );
};

export default Card;
