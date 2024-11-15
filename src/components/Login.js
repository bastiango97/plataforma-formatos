// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error messages

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/'); // Redirect to the homepage after successful login
            } else if (response.status === 401) {
                setErrorMessage('Correo o contraseña incorrectos'); // Specific message for invalid credentials
            } else {
                setErrorMessage('Error en el inicio de sesión. Inténtalo de nuevo más tarde.'); // General error message
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            setErrorMessage('Error en el servidor. Inténtalo de nuevo más tarde.'); // Server error message
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message if exists */}
            </form>
            <p className="register-link">
                ¿No tienes una cuenta? <Link to="/register">Registrarse</Link>
            </p>
        </div>
    );
};

export default Login;
