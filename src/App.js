import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from './router/route';
import AppShell from './components/app-shell/AppShell';

function App() {
  return (
    <div className="App">
      <Router
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppShell><MainRoute /></AppShell>
      </Router>
    </div>
  );
}

export default App;
