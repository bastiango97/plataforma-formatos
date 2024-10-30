// src/components/Folder.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Folder.css'; // Ensure the correct CSS file is imported

// src/components/Folder.js or src/components/Format.js
const companyFormats = {
  gnp: [
    { name: "Reembolso de Gastos Médicos" }, // Only this API link is kept
    { name: "Solicitud de Accidente" },
    { name: "Programación de Cirugía" }
  ],
  axa: [
    { name: "Reembolso de Gastos Médicos" },
    { name: "Solicitud de Accidente" },
    { name: "Programación de Cirugía" }
  ],
  "la-latino": [
    { name: "Reembolso de Gastos Médicos", apiLink:"https://nomyvotyxahjsfx.form.io/lalatinoreembolso" },
    { name: "Solicitud de Accidente" },
    { name: "Programación de Cirugía" }
  ]
};
  

const Folder = () => {
  const { companyId } = useParams();
  const formats = companyFormats[companyId] || [];

  return (
    <div className="container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Aseguradoras</Link> {'>'} 
        <span>{companyId.toUpperCase()}</span>
      </div>

      <h2>{companyId.toUpperCase()} - Formatos</h2>
      <div className="format-grid">
        {formats.map((format, index) => (
          <div key={index} className="format-card">
            <Link to={`/folder/${companyId}/format/${format.name.toLowerCase().replace(" ", "-")}`} className="format-link">
              <div className="format-icon">📄</div>
              <div className="format-name">{format.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Folder;
