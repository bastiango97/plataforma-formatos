// src/components/Format.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formio } from 'formiojs';
import { createPDF } from '../pdfUtils'; // Import the createPDF function
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for form.io form
import './Format.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Format = () => {
    const { companyId, formatId } = useParams();
    const [formatDetails, setFormatDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormatDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/formats/${companyId}/${formatId}`, {
                    method: 'GET',
                    credentials: 'include' // Include credentials for cookie-based auth
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch format details');
                }
                const data = await response.json();
                setFormatDetails(data); // Store format details in state
            } catch (err) {
                console.error(err);
                setError('Error fetching format details');
            }
        };

        fetchFormatDetails();
    }, [companyId, formatId]);

    useEffect(() => {
        if (formatDetails?.api_link) {
            // Create the form and capture the form instance
            const formInstance = Formio.createForm(document.getElementById('formio'), formatDetails.api_link);

            // Set up an event listener to capture submission data and generate the PDF
            formInstance.then(form => {
                form.on('submit', (submission) => {
                    console.log('Form submission data:', submission.data);

                    // Call the createPDF function with the format data
                    createPDF(companyId.toUpperCase(), formatId.replace("-", " "), submission.data, formatDetails.pdf_filename, formatDetails.pdf_data);
                });

                // Translate button text after form is rendered
                form.on('render', () => {
                    const cancelButton = document.querySelector('.btn-wizard-nav-cancel');
                    const previousButton = document.querySelector('.btn-wizard-nav-previous');
                    const nextButton = document.querySelector('.btn-wizard-nav-next');
                    const submitButton = document.querySelector('.btn-wizard-nav-submit');
                    
                    if (cancelButton) cancelButton.innerHTML = 'Cancelar';
                    if (previousButton) previousButton.innerHTML = 'Anterior';
                    if (nextButton) nextButton.innerHTML = 'Siguiente';
                    if (submitButton) submitButton.innerHTML = 'Enviar Formulario';
                });
            });
        }
    }, [formatDetails, companyId, formatId]);

    if (error) return <div>{error}</div>;
    if (!formatDetails) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="breadcrumb">
                <Link to="/" className="breadcrumb-link">Aseguradoras</Link> {'>'} 
                <Link to={`/folder/${companyId}`} className="breadcrumb-link"> {companyId.toUpperCase()}</Link> {'>'} 
                <span>{formatId.replace("-", " ")}</span>
            </div>

            <h2>{companyId.toUpperCase()} - {formatId.replace("-", " ")}</h2>

            {/* Container where the Form.io form will be rendered */}
            <div id="formio" className="form-container"></div>
        </div>
    );
};

export default Format;
