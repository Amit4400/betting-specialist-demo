import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Redirect to appropriate login page
    return <Navigate to={requiredRole === 'admin' ? '/admin-login' : '/user-login'} replace />;
  }

  if (user.role !== requiredRole) {
    // User is logged in but wrong role - redirect to their appropriate page
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

