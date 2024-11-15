// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hub from './components/Hub';
import Folder from './components/Folder';
import Format from './components/Format';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
          <Route path="/folder/:companyId" element={<ProtectedRoute><Folder /></ProtectedRoute>} />
          <Route path="/folder/:companyId/format/:formatId" element={<ProtectedRoute><Format /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
