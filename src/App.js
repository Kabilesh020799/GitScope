import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from './router/route';

function App() {
  return (
    <div className="App">
      <Router>
        <MainRoute />
      </Router>
    </div>
  );
}

export default App;
