import React, { useState } from "react";
import "./style.scss";
import { useAuth } from "../../hooks/useAuth";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signin, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    signin({ username, password });
  };

  return (
    <div className="github-login">
      <div className="auth-container">
        <h1>Sign in to GitHub</h1>
        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="username">Username or email address</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">
            Password
            <a href="/forgot" className="forgot-link">
              Forgot password?
            </a>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            Sign in
          </button>
        </form>

        <div className="signup-callout">
          New to GitHub?{" "}
          <a href="/signup" className="signup-link">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signin;
