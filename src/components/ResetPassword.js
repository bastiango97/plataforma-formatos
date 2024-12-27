// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './ResetPassword.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false); // State for mismatch message
    const [status, setStatus] = useState({ type: 'form', message: '' });
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus({ type: 'error', message: 'Token no válido. Verifica el enlace.' });
        }
    }, [token]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordMismatch(password !== e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Restableciendo tu contraseña...' });

        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            setStatus({ type: 'form', message: '' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: '¡Tu contraseña ha sido restablecida con éxito!' });
            } else {
                setStatus({ type: 'error', message: data.error || 'Error al restablecer la contraseña.' });
            }
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            setStatus({ type: 'error', message: 'Error en el servidor. Inténtalo nuevamente más tarde.' });
        }
    };

    return (
        <div className="reset-password-container">
            <div className={`reset-password-card ${status.type}`}>
                {status.type === 'form' && (
                    <>
                        <h2>Restablecer Contraseña</h2>
                        <form onSubmit={handleSubmit} className="reset-password-form">
                            <input
                                type="password"
                                placeholder="Nueva Contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirmar Contraseña"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            {passwordMismatch && (
                                <p className="password-mismatch-message">Las contraseñas no coinciden.</p>
                            )}
                            <button type="submit">Restablecer Contraseña</button>
                        </form>
                    </>
                )}
                {status.type === 'loading' && (
                    <>
                        <h2>Restableciendo...</h2>
                        <p>{status.message}</p>
                    </>
                )}
                {status.type === 'success' && (
                    <>
                        <h2>¡Contraseña Restablecida!</h2>
                        <p>{status.message}</p>
                        <Link to="/login" className="button-primary">
                            Ir a Login
                        </Link>
                    </>
                )}
                {status.type === 'error' && (
                    <>
                        <h2>Error</h2>
                        <p>{status.message}</p>
                        <Link to="/login" className="button-secondary">
                            Ir a Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
