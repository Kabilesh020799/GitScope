import React from 'react';
import Login from '../containers/login';
import Dashboard from '../containers/dashboard/Dashboard';
import CommitActivity from '../containers/commit-activity';

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
  },
  {
    id: 'commit-activity',
    route: 'commit-activity',
    component: <CommitActivity />,
  },
];

export default routes;
