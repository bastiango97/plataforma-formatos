import React, { useEffect, useState } from 'react';
import { Formio } from 'formiojs';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Consultas = () => {
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/registrations`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Log error response
                    throw new Error(`Failed to fetch submissions: ${errorText}`);
                }

                const data = await response.json();
                setSubmissions(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSubmissions();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (submissions.length === 0) {
        return <div>Loading submissions...</div>;
    }

    return (
        <div>
            <h1>Consultas</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {submissions.map((submission) => (
                    <div
                        key={submission.registration_id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '5px',
                            width: '300px',
                        }}
                    >
                        <h3>{submission.format_name}</h3>
                        <p><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleString()}</p>
                        <p><strong>Status:</strong> {submission.status}</p>
                        <p><strong>Notes:</strong> {submission.notes || 'N/A'}</p>
                        
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(`${API_BASE_URL}/generate-download-link`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            formId: submission.form_id,
                                            submissionId: submission.submission_id,
                                        }),
                                    });

                                    if (!response.ok) {
                                        const errorText = await response.text(); // Log error response
                                        throw new Error(`Failed to generate download link: ${errorText}`);
                                    }

                                    const { downloadLink } = await response.json();

                                    const link = document.createElement('a');
                                    link.href = downloadLink;
                                    link.target = '_blank';
                                    link.download = `${submission.format_name}.pdf`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } catch (error) {
                                    console.error('Error downloading PDF:', error);
                                }
                            }}
                        >
                            Download PDF
                        </button>

                        <button
                            onClick={async () => {
                                try {
                                    // Fetch the form name using the form ID
                                    const response = await fetch(`${API_BASE_URL}/form-name/${submission.form_id}`);
                                    if (!response.ok) {
                                        throw new Error('Failed to fetch form name');
                                    }
                                    const { formName } = await response.json();

                                    // Open the new tab with the correct form name and submission ID
                                    window.open(`/filled-submission/${formName}/${submission.submission_id}`, '_blank');
                                } catch (error) {
                                    console.error('Error fetching form name:', error);
                                }
                            }}
                        >
                            Open Filled Submission
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Consultas;
