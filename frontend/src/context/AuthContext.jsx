// File: ./frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe(token);
        setUser(res.user);
        setAccessToken(token);
      } catch {
        try {
          const refreshed = await authService.refresh();
          localStorage.setItem('accessToken', refreshed.accessToken);
          setAccessToken(refreshed.accessToken);
          const me = await authService.getMe(refreshed.accessToken);
          setUser(me.user);
        } catch {
          localStorage.removeItem('accessToken');
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password, phone = null) => {
    const payload = phone ? { phone, password } : { email, password };
    const res = await authService.login(payload);
    localStorage.setItem('accessToken', res.accessToken);
    setAccessToken(res.accessToken);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (name, email, phone, password) => {
    const res = await authService.register({ name, email, phone, password });
    localStorage.setItem('accessToken', res.accessToken);
    setAccessToken(res.accessToken);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
  }, []);

  const updateToken = useCallback((newToken) => {
    localStorage.setItem('accessToken', newToken);
    setAccessToken(newToken);
  }, []);

  // Used by GoogleAuthSuccess page — token comes from URL query param after OAuth redirect
  const loginWithToken = useCallback(async (token) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
    const res = await authService.getMe(token);
    setUser(res.user);
    return res;
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, accessToken, loading,
      isAuthenticated, isAdmin,
      login, register, logout, updateToken, loginWithToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};