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
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const navigate = useNavigate(); // Initialize useNavigate

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
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate('/login'); // Redirect to login after successful registration
            } else if (response.status === 400) {
                setErrorMessage('Este correo electrónico ya tiene una cuenta.'); // Error for duplicate email
            } else {
                setErrorMessage('Error en el registro. Inténtalo de nuevo más tarde.'); // General error message
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            setErrorMessage('Error en el servidor. Inténtalo de nuevo más tarde.'); // Server error message
        }
    };

    return (
        <div className="register-container">
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
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message if exists */}
            </form>
            <p className="login-link">
                ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
            </p>
        </div>
    );
};

export default Register;
