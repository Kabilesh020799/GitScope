import { useCallback, useState } from "react";
import { onSignin } from "../containers/signin/apiCall";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const signin = useCallback(
    async ({ username, password }) => {
      setError("");
      const res = await onSignin({
        username,
        password,
        onError: (val) => setError(val),
        dispatch,
      });
      if (res.success) {
        navigate("/search");
      }
    },
    [dispatch]
  );

  return { signin, error };
};
