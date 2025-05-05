import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./routesInfo";
import { CircularProgress } from "@mui/material";

const MainRoute = () => {
  return (
    <Suspense fallback={<CircularProgress size={60} />}>
      <Routes>
        {routes?.map((route) => (
          <Route
            key={route?.id}
            path={route?.route}
            element={route?.component}
          />
        ))}
        <Route path="*" element={<Navigate to="/search" />} />
      </Routes>
    </Suspense>
  );
};

export default MainRoute;
