import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading screen while checking authentication
//   if (loading) {
//     return <LoadingScreen />;
//   }

    console.log("in ProtectedRoute");

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    console.log("is not Authentication");
    return <Navigate to="/" replace />;
  }

  // Admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;