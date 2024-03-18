import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from './router/route';
// import { useSelector } from 'react-redux';
// import { CircularProgress } from '@mui/material';

function App() {
  // const {loading,} = useSelector(state => state.commitReducer);

  return (
    <div className="App">
      <Router>
        <MainRoute />
      </Router>
    </div>
  );
}

export default App;
