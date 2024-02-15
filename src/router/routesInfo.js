import React from 'react';
import Login from '../containers/login';
import Dashboard from '../containers/dashboard/Dashboard';

const routes = [
  {
    id: 'login',
    route: 'login',
    component: <Login />,
  },
  {
    id: 'dashboard',
    route: 'dashboard',
    component: <Dashboard />
  }
];

export default routes;
