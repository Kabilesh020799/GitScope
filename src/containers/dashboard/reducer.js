import { createSlice } from '@reduxjs/toolkit';

const commitSlice = createSlice({
  name: 'commits',
  initialState: {
    commits: [],
    collaborators: [],
    totalCommits: 0,
  },
  reducers: {
    addCommits (state, action) {
      state.commits = [...state.commits, ...action.payload.data];
    },
    clearCommits (state) {
      state.commits = [];
    },
    addCollaborators (state, action) {
      state.collaborators = [...state.collaborators, ...action.payload.data];
    },
    clearCollaborators (state) {
      state.collaborators = [];
    },
    addTotalCommits (state, action) {
      state.totalCommits = action.payload.data;
    },
    clearTotalCommits (state) {
      state.totalCommits = 0;
    },
  }
});

export const {
  addCommits,
  clearCommits,
  addCollaborators,
  clearCollaborators,
  addTotalCommits,
  clearTotalCommits,
} = commitSlice.actions;

export default commitSlice.reducer;
