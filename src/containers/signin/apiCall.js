import { ENDPOINTS } from "../../constants/api";
import { setStorage } from "../../utils/common-utils";
import { addToken } from "./reducer";

const onSignin = async (params) => {
  const { username, password, onError, dispatch } = params;

  try {
    const response = await fetch(ENDPOINTS.login, {
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
    return { success: true };
  } catch (err) {
    onError(err.message || "Something went wrong");
    return { success: false };
  }
};

export { onSignin };
