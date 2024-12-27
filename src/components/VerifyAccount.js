// src/pages/VerifyAccount.js
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './VerifyAccount.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const VerifyAccount = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState({ type: 'loading', message: 'Verificando...' });
    const token = searchParams.get('token');
    const hasVerified = useRef(false); // Prevent double execution

    useEffect(() => {
        const verifyAccount = async () => {
            if (!token || hasVerified.current) return; // Prevent re-running without a valid token

            hasVerified.current = true; // Mark as already verified

            try {
                const response = await fetch(`${API_BASE_URL}/verify-account`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus({ type: 'success', message: '¡Tu cuenta ha sido verificada con éxito!' });
                } else {
                    setStatus({ type: 'error', message: data.error || 'Error al verificar tu cuenta. Intenta nuevamente.' });
                }
            } catch (error) {
                console.error('Error al verificar la cuenta:', error);
                setStatus({ type: 'error', message: 'Error en el servidor. Intenta nuevamente más tarde.' });
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div className="verify-account-container">
            <div className={`verify-card ${status.type}`}>
                {status.type === 'loading' && (
                    <>
                        <h2>Verificando tu cuenta...</h2>
                        <p>Por favor, espera un momento.</p>
                    </>
                )}
                {status.type === 'success' && (
                    <>
                        <h2>¡Cuenta Verificada!</h2>
                        <p>{status.message}</p>
                        <Link to="/login" className="button-primary">
                            Ir a Login
                        </Link>
                    </>
                )}
                {status.type === 'error' && (
                    <>
                        <h2>Error al Verificar</h2>
                        <p>{status.message}</p>
                        <Link to="/register" className="button-secondary">
                            Ir a Registro
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount;
