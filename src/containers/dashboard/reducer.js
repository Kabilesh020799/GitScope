import { createSlice } from '@reduxjs/toolkit';

const commitSlice = createSlice({
  name: 'commits',
  initialState: {
    commits: []
  },
  reducers: {
    addCommits (state, action) {
      state.commits = [...action.payload.data];
    },
    clearCommits (state) {
      state.commits = [];
    },
  }
});

export const { addCommits, clearCommits } = commitSlice.actions;

export default commitSlice.reducer;
