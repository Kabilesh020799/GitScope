import { createSlice } from '@reduxjs/toolkit';

const commitSlice = createSlice({
  name: 'commits',
  initialState: {
    commits: [],
    collaborators: []
  },
  reducers: {
    addCommits (state, action) {
      state.commits = [...action.payload.data];
    },
    clearCommits (state) {
      state.commits = [];
    },
    addCollaborators (state, action) {
      state.collaborators = [...action.payload.data];
    },
    clearCollaborators (state) {
      state.collaborators = [];
    },
  }
});

export const { addCommits, clearCommits, addCollaborators, clearCollaborators, } = commitSlice.actions;

export default commitSlice.reducer;
