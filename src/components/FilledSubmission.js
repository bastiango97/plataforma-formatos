import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formio } from 'formiojs';
import 'bootstrap/dist/css/bootstrap.min.css';

const FilledSubmission = () => {
    const { formName, submissionId } = useParams(); // Get form name and submission ID from URL
    const [submissionData, setSubmissionData] = useState(null);
    const [error, setError] = useState(null);
    const formApiUrl = `https://nomyvotyxahjsfx.form.io/${formName}`;

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const formio = new Formio(`${formApiUrl}/submission/${submissionId}`);
                const submission = await formio.loadSubmission();
                setSubmissionData(submission);
            } catch (err) {
                console.error('Error loading submission:', err);
                setError('Failed to load submission.');
            }
        };

        fetchSubmission();
    }, [submissionId, formApiUrl]);

    useEffect(() => {
        if (submissionData) {
            Formio.createForm(document.getElementById('formio-container'), formApiUrl)
                .then((form) => {
                    form.submission = submissionData; // Ensure submission data is set
                    console.log('Form rendered with submission data:', submissionData);
                })
                .catch((err) => console.error('Error creating form:', err));
        }
    }, [submissionData]);

    if (error) return <div>{error}</div>;
    if (!submissionData) return <div>Loading submission data...</div>;

    return (
        <div className="container mt-4">
            <h2>Filled Submission - {formName}</h2>
            <div id="formio-container" className="form-container"></div>
        </div>
    );
};

export default FilledSubmission;
