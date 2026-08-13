import React, { useState } from "react";
import "./style.scss";
import { useAuth } from "../../hooks/useAuth";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signin, error, isSigningIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    signin({ username, password });
  };

  return (
    <div className="github-login">
      <div className="auth-container">
        <div className="auth-brand" aria-hidden="true">G</div>
        <p className="auth-eyebrow">Welcome back</p>
        <h1>Sign in to GitScope</h1>
        <p className="auth-intro">Connect to your repository analytics workspace.</p>
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

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-message" role="alert">{error}</div>}

          <button type="submit" className="submit-btn" disabled={isSigningIn}>
            {isSigningIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-footnote">Your credentials are used only to establish your GitScope session.</p>
      </div>
    </div>
  );
};

export default Signin;
