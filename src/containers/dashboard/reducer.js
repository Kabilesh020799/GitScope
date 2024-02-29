import { createSlice } from '@reduxjs/toolkit';

const commitSlice = createSlice({
  name: 'commits',
  initialState: {
    commits: [],
    collaborators: [],
    totalCommits: 0,
    createdYear: null,
    totalCollaborators: 0,
  },
  reducers: {
    addCommits (state, action) {
      state.commits = [...state.commits, ...action.payload.data];
    },
    replaceCommits (state, action) {
      state.commits = [...action.payload.data];
    },
    clearCommits (state) {
      state.commits = [];
    },
    addCollaborators (state, action) {
      state.collaborators = [...state.collaborators, ...action.payload.data];
    },
    replaceCollaborators (state, action) {
      state.collaborators = [...action.payload.data];
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
    addCreatedDate (state, action) {
      state.createdYear = action.payload.data;
    },
    clearCreatedDate (state) {
      state.createdYear = null;
    },
    addTotalCollaborators (state, action) {
      state.totalCollaborators = action.payload.data;
    },
    clearTotalCollaborators (state) {
      state.totalCollaborators = 0;
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
  clearCreatedDate,
  addCreatedDate,
  replaceCommits,
  replaceCollaborators,
  addTotalCollaborators,
  clearTotalCollaborators,
} = commitSlice.actions;

export default commitSlice.reducer;
