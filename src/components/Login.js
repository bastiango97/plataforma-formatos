// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State toggle for Forgot Password
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleForgotPasswordChange = (e) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

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
                setErrorMessage('Correo o contraseña incorrectos');
            } else {
                setErrorMessage('Error en el inicio de sesión. Inténtalo de nuevo más tarde.');
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            setErrorMessage('Error en el servidor. Inténtalo de nuevo más tarde.');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotPasswordEmail })
            });

            if (response.ok) {
                setSuccessMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
            } else {
                setErrorMessage('Error al enviar el enlace de recuperación. Inténtalo más tarde.');
            }
        } catch (error) {
            console.error('Error durante la recuperación de contraseña:', error);
            setErrorMessage('Error en el servidor. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="login-container">
            {!isForgotPassword ? (
                <>
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
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </form>
                    <p className="forgot-password-link">
                        <button onClick={() => setIsForgotPassword(true)}>¿Olvidaste tu contraseña?</button>
                    </p>
                    <p className="register-link">
                        ¿No tienes una cuenta? <Link to="/register">Registrarse</Link>
                    </p>
                </>
            ) : (
                <>
                    <h2>Recuperar Contraseña</h2>
                    <form onSubmit={handleForgotPassword} className="login-form">
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={forgotPasswordEmail}
                            onChange={handleForgotPasswordChange}
                            required
                        />
                        <button type="submit">Enviar Enlace de Recuperación</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </form>
                    <p className="forgot-password-link">
                        <button onClick={() => setIsForgotPassword(false)}>Volver a Iniciar Sesión</button>
                    </p>
                </>
            )}
        </div>
    );
};

export default Login;
