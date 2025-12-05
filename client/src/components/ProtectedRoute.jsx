import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth();

  // ⏳ Wait until token verification is complete before deciding
  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  // ✅ Redirect only if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
