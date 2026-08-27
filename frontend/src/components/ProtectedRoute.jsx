import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner message="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if role not allowed
    if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'Placement Officer') return <Navigate to="/officer-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
