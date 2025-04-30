import { createSlice } from "@reduxjs/toolkit";
import { getStorage } from "../../utils/common-utils";

const signinSlice = createSlice({
  name: "signin",
  initialState: {
    bearerToken: getStorage("token") || "",
  },
  reducers: {
    addToken(state, action) {
      state.bearerToken = action.payload.data;
    },
    clearToken(state) {
      state.bearerToken = "";
    },
  },
});

export const { addToken, clearToken } = signinSlice.actions;

export default signinSlice.reducer;
