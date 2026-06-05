// File: ./frontend/src/components/auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './ForgotPassword.css';

const STEPS = {
  REQUEST: 'request',   // Enter email
  SUCCESS: 'success',   // Email sent confirmation
};

const ForgotPassword = () => {
  const [step, setStep] = useState(STEPS.REQUEST);
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  const isPhone = /^[6-9]\d{9}$/.test(identifier.trim());
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || (!isEmail && !isPhone)) {
      setError('Please enter a valid email address or 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = isPhone
        ? { phone: identifier.trim() }
        : { email: identifier.trim() };
      const res = await api.post('/auth/forgot-password', payload);
      setModalData({ found: res.found, maskedEmail: res.maskedEmail });
    } catch (err) {
      const data = err.response?.data;
      setModalData({ found: data?.found ?? false, maskedEmail: data?.maskedEmail ?? null });
    } finally {
      setLoading(false);
    }
  };

  if (step === STEPS.SUCCESS) {
    return (
      <div className="fp-card">
        <div className="fp-success-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2>Check Your Email</h2>
        <p className="fp-success-text">
          If an account exists for <strong>{identifier}</strong>, we've sent a
          password reset link. It expires in <strong>1 hour</strong>.
        </p>
        <p className="fp-spam-note">
          Didn't receive it? Check your spam folder.
        </p>
        <div className="fp-footer">
          <Link to="/login" className="fp-back-link">← Back to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-card">
      <div className="fp-header">
        <h2>Forgot Password?</h2>
        <p>Enter your email and we'll send you a reset link.</p>
      </div>

      {error && <div className="fp-error">{error}</div>}

      <form onSubmit={handleSubmit} className="fp-form" noValidate>
        <div className="fp-field">
          <label htmlFor="fp-identifier">Email or Mobile Number</label>
          <input
            id="fp-identifier"
            type="text"
            value={identifier}
            onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
            placeholder="you@example.com or 9876543210"
            autoComplete="username"
            autoFocus
          />
        </div>

        <button type="submit" className="fp-submit-btn" disabled={loading}>
          {loading ? <span className="fp-spinner" /> : 'Send Reset Link'}
        </button>
      </form>

      <div className="fp-footer">
        <Link to="/login" className="fp-back-link">← Back to Sign In</Link>
      </div>

      {modalData && (
        <div className="fp-modal-backdrop" onClick={() => {
          if (modalData?.found) setStep(STEPS.SUCCESS);
          setModalData(null);
        }}>
          <div className="fp-modal" onClick={e => e.stopPropagation()}>

            <div className="fp-modal-icon">
              {modalData.found ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="fp-modal-icon-svg fp-modal-icon-success">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="fp-modal-icon-svg fp-modal-icon-error">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <h3>{modalData.found ? 'Reset Link Sent!' : 'Account Not Found'}</h3>

            {modalData.found ? (
              <>
                <p className="fp-modal-text">A password reset link has been sent to</p>
                <p className="fp-modal-identifier">{modalData.maskedEmail}</p>
                <p className="fp-modal-text">It expires in <strong>1 hour</strong>.</p>
                <p className="fp-modal-spam">Didn't receive it? Check your spam folder.</p>
              </>
            ) : (
              <p className="fp-modal-text">
                No account is registered with <strong>{identifier}</strong>.
                Please check and try again or{' '}
                <Link to="/register" className="fp-back-link">create an account</Link>.
              </p>
            )}

            <button
              className="fp-submit-btn"
              onClick={() => {
                if (modalData.found) {
                  setModalData(null);
                  setStep(STEPS.SUCCESS);
                } else {
                  setModalData(null);
                }
              }}
            >
              {modalData.found ? 'Got it' : 'Try Again'}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;