import { setStorage } from "../../utils/common-utils";
import { addToken } from "./reducer";

const API_URL = process.env.REACT_APP_API_URL;

const onSignin = async (params) => {
  const { username, password, onError, dispatch } = params;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Login failed");
    }

    const data = await response.json();
    setStorage("token", data.token);
    dispatch(addToken({ data: data.token }));

    window.location.href = "/search";
  } catch (err) {
    onError(err.message || "Something went wrong");
  }
};

export { onSignin };
