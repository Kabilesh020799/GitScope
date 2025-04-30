import React from "react";
import Login from "../containers/login";
import Dashboard from "../containers/dashboard/Dashboard";
import CommitActivity from "../containers/commit-activity";
import ContributorActivity from "../containers/contributor-activity";
import CommentActivity from "../containers/comment-activity";
import ContributorRelation from "../containers/contributor-relation";
import UserContributions from "../containers/user-contributions";
import Signin from "../containers/signin";

const routes = [
  {
    id: "login",
    route: "login",
    component: <Signin />,
  },
  {
    id: "search",
    route: "search",
    component: <Login />,
  },
  {
    id: "dashboard",
    route: "dashboard",
    component: <Dashboard />,
  },
  {
    id: "commit-activity",
    route: "commit-activity",
    component: <CommitActivity />,
  },
  {
    id: "contributor-activity",
    route: "contributor-activity",
    component: <ContributorActivity />,
  },
  {
    id: "comment-activity",
    route: "comment-activity",
    component: <CommentActivity />,
  },
  {
    id: "contributor-relation",
    route: "contributor-relation",
    component: <ContributorRelation />,
  },
  {
    id: "user-contribution",
    route: "user-contribution",
    component: <UserContributions />,
  },
];

export default routes;
