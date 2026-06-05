// File: ./frontend/src/components/auth/RegisterForm.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './RegisterForm.css';
import GoogleAuthButton from './GoogleAuthButton';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = '/';

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};

    if (!formData.name.trim() || formData.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.';

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Valid email is required.';

    if (!formData.phone) {
      e.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      e.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.password || formData.password.length < 6)
      e.password = 'Password must be at least 6 characters.';

    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';

    return e;
  };

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.phone, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eyeOpen = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
  const eyeClosed = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className="reg-card">

      {/* ── Decorative accent bar ── */}
      <div className="reg-accent-bar">
        <span className="reg-accent-text">Corporate Pehnawa</span>
        <span className="reg-accent-divider">✦</span>
        <span className="reg-accent-text">Fashion for You</span>
      </div>

      {/* ── Header ── */}
      <div className="reg-header">
        <h2>Create Account</h2>
        <p>Your style journey starts here</p>
      </div>

      {apiError && <div className="reg-error">{apiError}</div>}

      <form onSubmit={handleSubmit} className="reg-form" noValidate>

        {/* ── Full Name — full width ── */}
        <div className="reg-field">
          <label htmlFor="name">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Full Name
          </label>
          <input
            id="name" name="name" type="text"
            value={formData.name} onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          {errors.name && <span className="reg-field-error">{errors.name}</span>}
        </div>

        {/* ── Email + Phone — two columns ── */}
        <div className="reg-row">
          <div className="reg-field">
            <label htmlFor="reg-email">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              Email
            </label>
            <input
              id="reg-email" name="email" type="email"
              value={formData.email} onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            {errors.email && <span className="reg-field-error">{errors.email}</span>}
          </div>

          <div className="reg-field">
            <label htmlFor="phone">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" /></svg>
              Phone
              {/* <span className="reg-optional">optional</span> */}
            </label>
            <input
              id="phone" name="phone" type="tel"
              value={formData.phone} onChange={handleChange}
              placeholder="10-digit number"
              autoComplete="tel"
              required
            />
            {errors.phone && <span className="reg-field-error">{errors.phone}</span>}
          </div>
        </div>

        {/* ── Ornamental section break ── */}
        <div className="reg-ornament">
          <span className="reg-ornament-line" />
          <span className="reg-ornament-icon">🔒</span>
          <span className="reg-ornament-line" />
        </div>

        {/* ── Password + Confirm — two columns ── */}
        <div className="reg-row">
          <div className="reg-field">
            <label htmlFor="reg-password">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Password
            </label>
            <div className="reg-pw-wrap">
              <input
                id="reg-password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
              />
              <button type="button" className="reg-pw-toggle" onClick={() => setShowPassword(p => !p)} aria-label="Toggle password">
                {showPassword ? eyeClosed : eyeOpen}
              </button>
            </div>
            {errors.password && <span className="reg-field-error">{errors.password}</span>}
          </div>

          <div className="reg-field">
            <label htmlFor="confirmPassword">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4" /><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Confirm Password
            </label>
            <input
              id="confirmPassword" name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword} onChange={handleChange}
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
            />
            {errors.confirmPassword && <span className="reg-field-error">{errors.confirmPassword}</span>}
          </div>
        </div>

        <button type="submit" className="reg-submit-btn" disabled={loading}>
          {loading
            ? <span className="reg-spinner" />
            : <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
              Create Account
            </>
          }
        </button>

        {/* ── OR divider ── */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        <GoogleAuthButton label="Sign up with Google" />

      </form>

      <div className="reg-footer">
        <p>Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Sign in</Link></p>
      </div>

    </div>
  );
};

export default RegisterForm;