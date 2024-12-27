// src/pages/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(false); // State for verification message
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsVerificationSent(true); // Show verification message
            } else if (response.status === 400) {
                setErrorMessage('Este correo electrónico ya tiene una cuenta.');
            } else {
                setErrorMessage('Error en el registro. Inténtalo de nuevo más tarde.');
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            setErrorMessage('Error en el servidor. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="register-container">
            {!isVerificationSent ? (
                <>
                    <h2>Registrarse</h2>
                    <form onSubmit={handleSubmit} className="register-form">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Nombre"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Apellido"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
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
                        <button type="submit">Registrarse</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                    <p className="login-link">
                        ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                    </p>
                </>
            ) : (
                <div className="verification-message">
                    <h2>¡Registro Exitoso!</h2>
                    <p>
                        Hemos enviado un correo electrónico a <strong>{formData.email}</strong> con un enlace para verificar tu cuenta.
                    </p>
                    <p>
                        Por favor revisa tu bandeja de entrada y sigue las instrucciones.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Register;
