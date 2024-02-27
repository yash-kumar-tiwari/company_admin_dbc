// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../ReduxToolkit/authSlice";

const PrivateRoute = ({ element, roles }) => {
  const auth = useSelector(selectAuth);

  // Check if the user is authenticated and has the required role
  const isAuthenticated = auth.isAuthenticated && roles.includes(auth.role);

  return (
    <>
      {isAuthenticated ? (
        <Route element={element} />
      ) : (
        <Navigate to="/signup" />
      )}
    </>
  );
};

export default PrivateRoute;
