// src/components/Format.js
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formio } from 'formiojs';
import { createPDF } from '../pdfUtils'; // Import the createPDF function
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for the form.io form
import './Format.css'; // Ensure the correct CSS file is imported

const companyFormats = {
    gnp: [
      { name: "Reembolso de Gastos Médicos", apiLink: "https://nomyvotyxahjsfx.form.io/gnpreembolso" }, // Example API link
      { name: "Solicitud de Accidente" },
      { name: "Programación de Cirugía" }
    ],
    axa: [
      { name: "Reembolso de Gastos Médicos" },
      { name: "Solicitud de Accidente" },
      { name: "Programación de Cirugía" }
    ],
    "la-latino": [
      { name: "Reembolso de Gastos Médicos", apiLink: "https://nomyvotyxahjsfx.form.io/lalatinoreembolso" },
      { name: "Solicitud de Accidente" },
      { name: "Programación de Cirugía" }
    ]
};

const Format = () => {
    const { companyId, formatId } = useParams();
  
    const format = companyFormats[companyId]?.find(f => f.name.toLowerCase().replace(" ", "-") === formatId);
    const formApiLink = format?.apiLink;
  
    useEffect(() => {
      if (formApiLink) {
        // Create the form and capture the form instance
        const formInstance = Formio.createForm(document.getElementById('formio'), formApiLink);
  
        // Set up an event listener to capture submission data and generate the PDF
        formInstance.then(form => {
          form.on('submit', (submission) => {
            console.log('Form submission data:', submission.data);
            
            // Call the createPDF function with the insurance company name, format name, and form data
            createPDF(companyId.toUpperCase(), formatId.replace("-", " "), submission.data);
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
    }, [formApiLink, companyId, formatId]);
  
    return (
      <div className="container mt-4">
        {/* Breadcrumb navigation */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Aseguradoras</Link> {'>'} 
          <Link to={`/folder/${companyId}`} className="breadcrumb-link"> {companyId.toUpperCase()}</Link> {'>'} 
          <span>{formatId.replace("-", " ")}</span>
        </div>
  
        <h2>{companyId.toUpperCase()} - {formatId.replace("-", " ")}</h2>
  
        {/* Container where the Form.io form will be rendered, Bootstrap styles applied only here */}
        <div id="formio" className="form-container"></div>
      </div>
    );
};

export default Format;
