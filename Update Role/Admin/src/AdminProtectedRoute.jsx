import React from 'react';
import Cookies from 'js-cookie';
import Login from './Components/Login';

const AdminProtectedRoute = ({ children }) => {
    const superToken = Cookies.get("superToken");
    
    if (!superToken) {
        alert("Super Admin access required. Please login again.");
        return <Login />;
    }
    
    return children;
};

export default AdminProtectedRoute;