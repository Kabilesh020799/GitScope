import React from 'react';
import Login from '../containers/login';
import Dashboard from '../containers/dashboard/Dashboard';
import CommitActivity from '../containers/commit-activity';
import ContributorActivity from '../containers/contributor-activity';
import CommentActivity from '../containers/comment-activity';

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
  {
    id: 'contributor-activity',
    route: 'contributor-activity',
    component: <ContributorActivity />,
  },
  {
    id: 'comment-activity',
    route: 'comment-activity',
    component: <CommentActivity />,
  },
];

export default routes;
