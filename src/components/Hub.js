// src/components/Hub.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hub.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Hub = () => {
    const [insuranceCompanies, setInsuranceCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsuranceCompanies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/insurance-companies`, {
                    method: 'GET',
                    credentials: 'include' // Include credentials for cookie-based auth
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch insurance companies');
                }
                const data = await response.json();
                setInsuranceCompanies(data); // Store insurance companies in state
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Error fetching insurance companies');
                setLoading(false);
            }
        };

        fetchInsuranceCompanies();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2>Aseguradoras</h2>
            <div className="folder-grid">
                {insuranceCompanies.map((company, index) => (
                    <div key={index} className="folder-card">
                        <Link to={`/folder/${company.toLowerCase().replace(" ", "-")}`} className="folder-link">
                            <div className="folder-icon">📁</div>
                            <div className="folder-name">{company}</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hub;
