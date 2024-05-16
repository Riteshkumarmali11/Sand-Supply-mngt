// AuthRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const AuthRoute = () => {
    const { auth } = useAuth();

    return auth.token ? <Outlet /> : <Navigate to="/" />;
};

export default AuthRoute;
