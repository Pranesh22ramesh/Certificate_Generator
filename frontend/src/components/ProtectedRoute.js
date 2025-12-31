import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSelector } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType, authLoading } = useAuthSelector();

  console.log('🛡️ ProtectedRoute check:', { 
    isAuthenticated, 
    userType, 
    authLoading, 
    requiredUserType,
    path: window.location.pathname
  });

  // Show loading spinner while checking authentication
  if (authLoading) {
    console.log('⏳ Auth still loading...');
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  // If not authenticated, redirect to appropriate login
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    const loginPath = requiredUserType === 'admin' ? '/admin/login' : '/user/login';
    return <Navigate to={loginPath} replace />;
  }

  // If authenticated but wrong user type, redirect to appropriate page
  if (requiredUserType && userType !== requiredUserType) {
    console.log('⚠️ Wrong user type, redirecting');
    if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userType === 'user') {
      return <Navigate to="/user/certificate" replace />;
    }
    // If userType is unknown, logout and redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has correct permissions
  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;