// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but no permission → send to /products/my
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/products/my" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
