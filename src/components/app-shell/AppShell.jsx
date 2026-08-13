import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthControls from "../auth-controls/AuthControls";

const AppShell = ({ children }) => {
  const location = useLocation();
  const token = useSelector((state) => state.signinReducer.bearerToken);
  const repoUrl = useSelector((state) => state.loginReducer.repoUrl);
  const repoName = repoUrl?.split("/").filter(Boolean).slice(-2).join("/");

  if (location.pathname === "/login" || !token) return children;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="app-header">
        <NavLink className="app-brand" to="/search" aria-label="GitScope repository search">
          <span className="app-brand-mark" aria-hidden="true">G</span>
          <span className="app-brand-copy"><strong>GitScope</strong><small>Repository intelligence</small></span>
        </NavLink>
        <nav className="app-nav" aria-label="Primary navigation">
          <NavLink to="/search">Repositories</NavLink>
          {repoUrl && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
        <div className="app-header-actions">
          {repoName && <span className="active-repository" title={repoUrl}><span aria-hidden="true">⌁</span> {repoName}</span>}
          <AuthControls />
        </div>
      </header>
      <main className="app-main" id="main-content">{children}</main>
    </div>
  );
};

export default AppShell;
