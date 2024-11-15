// src/components/Folder.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Folder.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Folder = () => {
    const { companyId } = useParams();
    const [formats, setFormats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/formats/${companyId}`, {
                    method: 'GET',
                    credentials: 'include' // Include credentials for cookie-based auth
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch formats');
                }
                const data = await response.json();
                setFormats(data); // Set formats from API response
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Error fetching formats');
                setLoading(false);
            }
        };

        fetchFormats();
    }, [companyId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/" className="breadcrumb-link">Aseguradoras</Link> {'>'} 
                <span>{companyId.toUpperCase()}</span>
            </div>

            <h2>{companyId.toUpperCase()} - Formatos</h2>
            <div className="format-grid">
                {formats.map((format, index) => (
                    <div key={index} className="format-card">
                        <Link to={`/folder/${companyId}/format/${format.format_name.toLowerCase().replace(" ", "-")}`} className="format-link">
                            <div className="format-icon">📄</div>
                            <div className="format-name">{format.format_name}</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Folder;
