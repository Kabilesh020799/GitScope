import React from "react";
import { NavLink } from "react-router-dom";

const DashboardRowCard = ({ title, path, linkText }) => (
  <div className="row-card">
    <span className="row-text">{title}</span>
    <NavLink className="nav-link" to={path}>
      {linkText}
      <i className="fa-solid fa-arrow-right"></i>
    </NavLink>
  </div>
);

export default React.memo(DashboardRowCard);
