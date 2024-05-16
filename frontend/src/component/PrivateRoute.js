import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider'; // Ensure AuthProvider provides authentication context

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Access the authentication state
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
