import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authContextValue = useContext(AuthContext);
  const location = useLocation();

  // First, check if the context value itself is available.
  // This guards against scenarios where the context might not be fully initialized
  // or if useContext somehow returned undefined.
  if (!authContextValue) {
    // This case should ideally not happen if AuthProvider is set up correctly,
    // but it's a good defensive check.
    console.error("AuthContext value is undefined in ProtectedRoute. Redirecting to login.");
    return <Navigate to="/login/customer" state={{ from: location }} replace />;
  }

  const { token, role } = authContextValue;

  // Check if the user is authenticated (i.e., has a token)
  if (!token) {
    // User not authenticated, redirect to login page
    // Save the current location so we can send them back after login
    return <Navigate to="/login/customer" state={{ from: location }} replace />;
  }

  // Check if the route requires specific roles and if the user has one of them
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User is authenticated but does not have the required role
    // Redirect to an unauthorized page or a default page. For now, login.
    return <Navigate to="/login/customer" state={{ from: location }} replace />; // Consider an "/unauthorized" page
  }

  // User is authenticated and has the required role (if any)
  return children;
};

export default ProtectedRoute;