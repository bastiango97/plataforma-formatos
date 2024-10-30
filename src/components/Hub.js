// src/components/Hub.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Hub.css';

// Array of insurance companies
const insuranceCompanies = ["GNP", "AXA", "La Latino"];

const Hub = () => {
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
