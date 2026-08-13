import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from './router/route';
import AuthControls from './components/auth-controls/AuthControls';

function App() {
  return (
    <div className="App">
      <Router
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthControls />
        <MainRoute />
      </Router>
    </div>
  );
}

export default App;
