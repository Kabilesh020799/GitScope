import { createSlice } from "@reduxjs/toolkit";
import { getStorage } from "../../utils/common-utils";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    repoUrl: getStorage("repo-url") || "",
  },
  reducers: {
    addRepoUrl(state, action) {
      state.repoUrl = action.payload.data;
    },
    clearRepoUrl(state) {
      state.repoUrl = "";
    },
  },
});

export const { addRepoUrl, clearRepoUrl } = loginSlice.actions;

export default loginSlice.reducer;
