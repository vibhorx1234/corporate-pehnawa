// File: ./frontend/src/components/auth/ResetPassword.jsx

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './ForgotPassword.css'; // shares same CSS

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // No token in URL — invalid link
  if (!token) {
    return (
      <div className="fp-card">
        <div className="fp-success-icon">❌</div>
        <h2>Invalid Link</h2>
        <p className="fp-success-text">
          This password reset link is invalid or has expired.
        </p>
        <div className="fp-footer">
          <Link to="/forgot-password" className="fp-back-link">Request a new link</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fp-card">
        <div className="fp-success-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2>Password Reset</h2>
        <p className="fp-success-text">
          Your password has been updated successfully. You can now sign in.
        </p>
        <div className="fp-footer">
          <Link to="/login" className="fp-back-link">Go to Sign In →</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: passwords.newPassword
      });
      setSuccess(true);
      // Auto redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-card">
      <div className="fp-header">
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
      </div>

      {error && <div className="fp-error">{error}</div>}

      <form onSubmit={handleSubmit} className="fp-form" noValidate>
        <div className="fp-field">
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type={showPw ? 'text' : 'password'}
            value={passwords.newPassword}
            onChange={(e) => { setPasswords(p => ({ ...p, newPassword: e.target.value })); setError(''); }}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            autoFocus
          />
        </div>

        <div className="fp-field">
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            type={showPw ? 'text' : 'password'}
            value={passwords.confirmPassword}
            onChange={(e) => { setPasswords(p => ({ ...p, confirmPassword: e.target.value })); setError(''); }}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </div>

        <label className="fp-show-pw">
          <input
            type="checkbox"
            checked={showPw}
            onChange={(e) => setShowPw(e.target.checked)}
          />
          Show passwords
        </label>

        <button type="submit" className="fp-submit-btn" disabled={loading}>
          {loading ? <span className="fp-spinner" /> : 'Reset Password'}
        </button>
      </form>

      <div className="fp-footer">
        <Link to="/login" className="fp-back-link">← Back to Sign In</Link>
      </div>
    </div>
  );
};

export default ResetPassword;