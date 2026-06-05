// File: ./frontend/src/components/auth/LoginForm.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './LoginForm.css';
import GoogleAuthButton from './GoogleAuthButton';

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = '/';

    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const isPhone = /^[6-9]\d{9}$/.test(formData.identifier.trim());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.identifier || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            await login(
                isPhone ? null : formData.identifier,
                formData.password,
                isPhone ? formData.identifier : null
            );
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const eyeOpen = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
    const eyeClosed = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    return (
        <div className="login-card">

            {/* ── Decorative accent bar ── */}
            <div className="login-accent-bar">
                <span className="login-accent-text">Corporate Pehnawa</span>
                <span className="login-accent-divider">✦</span>
                <span className="login-accent-text">Welcome Back</span>
            </div>

            {/* ── Header ── */}
            <div className="login-header">
                <h2>Sign in</h2>
                <p>Good to see you again</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form" noValidate>

                {/* ── Email ── */}
                <div className="login-field">
                    <label htmlFor="identifier">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        Email or Mobile Number
                    </label>
                    <input
                        id="identifier"
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="you@example.com or 9876543210"
                        autoComplete="username"
                        required
                    />
                </div>

                {/* ── Password ── */}
                <div className="login-field">
                    <label htmlFor="password">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Password
                    </label>
                    <div className="login-pw-wrap">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="login-pw-toggle"
                            onClick={() => setShowPassword(p => !p)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? eyeClosed : eyeOpen}
                        </button>
                    </div>
                </div>

                {/* ── Forgot password ── */}
                <div className="login-forgot">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>

                {/* ── Submit ── */}
                <button type="submit" className="login-submit-btn" disabled={loading}>
                    {loading
                        ? <span className="login-spinner" />
                        : <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Sign In
                        </>
                    }
                </button>

                {/* ── OR divider ── */}
                <div className="auth-divider">
                    <span className="auth-divider-line" />
                    <span className="auth-divider-text">or</span>
                    <span className="auth-divider-line" />
                </div>

                <GoogleAuthButton label="Sign in with Google" />

            </form>

            <div className="login-footer">
                <p>Don't have an account? <Link to="/register" state={{ from: location.state?.from }}>Create one</Link></p>
            </div>

        </div>
    );
};

export default LoginForm;