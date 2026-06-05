// File: ./frontend/src/pages/RegisterPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import './LoginPage.css'; // shares same layout CSS

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/account', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;