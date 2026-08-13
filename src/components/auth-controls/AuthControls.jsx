import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearRepoUrl } from "../../containers/login/reducer";
import { clearToken } from "../../containers/signin/reducer";
import { resetDashboard } from "../../containers/dashboard/reducer";
import { removeStorage } from "../../utils/common-utils";

const AuthControls = () => {
  const token = useSelector((state) => state.signinReducer.bearerToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!token) return null;

  const signOut = () => {
    removeStorage("token");
    removeStorage("repo-url");
    dispatch(clearToken());
    dispatch(clearRepoUrl());
    dispatch(resetDashboard());
    navigate("/login", { replace: true });
  };

  return (
    <button className="sign-out-button" type="button" onClick={signOut}>
      Sign out
    </button>
  );
};

export default AuthControls;
