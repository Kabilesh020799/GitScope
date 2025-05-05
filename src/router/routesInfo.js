import React, { lazy } from "react";
const Login = lazy(() => import("../containers/login"));
const Dashboard = lazy(() => import("../containers/dashboard/Dashboard"));
const CommitActivity = lazy(() => import("../containers/commit-activity"));
const ContributorActivity = lazy(() =>
  import("../containers/contributor-activity")
);
const CommentActivity = lazy(() => import("../containers/comment-activity"));
const ContributorRelation = lazy(() =>
  import("../containers/contributor-relation")
);
const UserContributions = lazy(() =>
  import("../containers/user-contributions")
);
const Signin = lazy(() => import("../containers/signin"));

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
