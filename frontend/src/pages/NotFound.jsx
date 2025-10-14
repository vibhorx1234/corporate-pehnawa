// File: ./frontend/src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="container notfound-container">
        <div className="notfound-content">
          <h1 className="notfound-title">404</h1>
          <h2 className="notfound-subtitle">Page Not Found</h2>
          <p className="notfound-text">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;