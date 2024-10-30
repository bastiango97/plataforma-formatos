// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Hub from './components/Hub';
import Folder from './components/Folder';
import Format from './components/Format';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/folder/:companyId" element={<Folder />} />
          <Route path="/folder/:companyId/format/:formatId" element={<Format />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
