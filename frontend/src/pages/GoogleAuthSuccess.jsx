import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { navigate('/login?error=google_failed'); return; }

    loginWithToken(token)
      .then(() => navigate('/account', { replace: true }))
      .catch(() => navigate('/login?error=google_failed'));
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ fontFamily: 'aptos, sans-serif', color: '#6b4423' }}>Signing you in...</p>
    </div>
  );
};

export default GoogleAuthSuccess;