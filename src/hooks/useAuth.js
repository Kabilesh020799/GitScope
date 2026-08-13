import { useCallback, useState } from "react";
import { onSignin } from "../containers/signin/apiCall";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signin = useCallback(
    async ({ username, password }) => {
      setError("");
      setIsSigningIn(true);
      const res = await onSignin({
        username,
        password,
        onError: (val) => setError(val),
        dispatch,
      });
      if (res.success) {
        navigate("/search");
      }
      setIsSigningIn(false);
    },
    [dispatch, navigate]
  );

  return { signin, error, isSigningIn };
};
