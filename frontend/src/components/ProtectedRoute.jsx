import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Restricts access to routes based on authentication and user role
 * 
 * @param {React.Component} element - The component to render if authorized
 * @param {string|string[]} allowedRoles - Role(s) that are allowed to access this route
 * @param {string} redirectTo - Path to redirect if not authorized (default: /login)
 */
export const ProtectedRoute = ({
  element,
  allowedRoles = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated, role } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If roles are specified and user role doesn't match, redirect
  if (allowedRoles.length > 0) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!rolesArray.includes(role)) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If all checks pass, render the component
  return element;
};

export default ProtectedRoute;
