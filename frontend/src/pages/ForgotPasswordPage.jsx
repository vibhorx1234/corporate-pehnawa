// File: ./frontend/src/pages/ForgotPasswordPage.jsx

import React from 'react';
import ForgotPassword from '../components/auth/ForgotPassword';
import './LoginPage.css'; // shares same layout CSS

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        <ForgotPassword />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;