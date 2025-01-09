import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formio } from 'formiojs';
import 'bootstrap/dist/css/bootstrap.min.css';
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
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch format details');
                }
                const data = await response.json();
                setFormatDetails(data);
            } catch (err) {
                console.error(err);
                setError('Error fetching format details');
            }
        };

        fetchFormatDetails();
    }, [companyId, formatId]);

    useEffect(() => {
        if (formatDetails?.api_link) {
            const formInstance = Formio.createForm(
                document.getElementById('formio'),
                formatDetails.api_link
            );

            formInstance.then((form) => {
                form.on('submit', async (submission) => {
                    console.log('Form submission data:', submission);
                    //Generate formID
                    const formioProject = new Formio(formatDetails.api_link);
                    const formId = await formioProject.getFormId();
                    try {
                        const submissionId = submission._id;
                        if (!submissionId) {
                            throw new Error('Submission ID is missing');
                        }
                        
                        // Call backend endpoint to generate the download link
                        const response = await fetch(`${API_BASE_URL}/generate-download-link`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                formId,
                                submissionId,
                            }),
                        });

                        if (!response.ok) {
                            throw new Error('Failed to generate download link');
                        }

                        const { downloadLink } = await response.json();

                        // Trigger download
                        const link = document.createElement('a');
                        link.href = downloadLink;
                        link.target = '_blank';
                        link.download = 'Filled-Form.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } catch (error) {
                        console.error('Error generating PDF download URL:', error);
                        setError('Failed to generate PDF download URL');
                    }
                });

                // Translate buttons after rendering
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
    }, [formatDetails]);

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
