// File: ./frontend/src/pages/ResetPasswordPage.jsx

import React from 'react';
import ResetPassword from '../components/auth/ResetPassword';
import './LoginPage.css'; // shares same layout CSS

const ResetPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        <ResetPassword />
      </div>
    </div>
  );
};

export default ResetPasswordPage;