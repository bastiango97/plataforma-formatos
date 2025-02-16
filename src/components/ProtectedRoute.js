// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as `null` to indicate loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth-check`, {
                    method: 'GET',
                    credentials: 'include', // Ensures cookies are sent with the request
                });

                if (response.ok) {
                    setIsAuthenticated(true); // Set `true` if token is valid
                } else {
                    setIsAuthenticated(false); // Set `false` if token is invalid or expired
                }
            } catch (error) {
                console.error('Error during auth check:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Show a loading state while checking authentication
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Render the Navbar and protected content if authenticated
    return (
        <>
            <Navbar /> {/* Include the Navbar */}
            {children}
        </>
    );
};

export default ProtectedRoute;
