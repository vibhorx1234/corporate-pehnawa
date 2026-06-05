// File: ./frontend/src/components/account/ProfileForm.jsx

import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import './ProfileForm.css';

const ProfileForm = () => {
  const { user, login } = useAuth();

  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || profileData.name.trim().length < 2) {
      setProfileMsg({ type: 'error', text: 'Name must be at least 2 characters.' });
      return;
    }
    setProfileLoading(true);
    try {
      await api.patch('/users/profile', profileData);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (!pwData.currentPassword || !pwData.newPassword) {
      setPwMsg({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (pwData.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setPwLoading(true);
    try {
      await api.patch('/users/change-password', {
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword
      });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed.' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="profile-form-wrap">
      {/* Profile info section */}
      <section className="pf-section">
        <h3>Personal Information</h3>
        <form onSubmit={handleProfileSubmit} className="pf-form" noValidate>
          <div className="pf-field">
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>
          <div className="pf-field">
            <label>Email Address</label>
            <input type="email" value={user?.email || ''} disabled />
            <span className="pf-hint">Email cannot be changed.</span>
          </div>
          <div className="pf-field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
              placeholder="10-digit mobile number"
            />
          </div>
          {profileMsg.text && (
            <div className={`pf-msg pf-msg--${profileMsg.type}`}>{profileMsg.text}</div>
          )}
          <button type="submit" className="pf-save-btn" disabled={profileLoading}>
            {profileLoading ? <span className="pf-spinner" /> : 'Save Changes'}
          </button>
        </form>
      </section>

      <div className="pf-divider" />

      {/* Change password section */}
      <section className="pf-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePwSubmit} className="pf-form" noValidate>
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div className="pf-field" key={field}>
              <label>
                {field === 'currentPassword' ? 'Current Password' :
                 field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
              </label>
              <div className="pf-pw-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pwData[field]}
                  onChange={e => setPwData(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={field === 'currentPassword' ? 'Enter current password' : 'Enter new password'}
                  autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>
          ))}
          <label className="pf-show-pw">
            <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} />
            Show passwords
          </label>
          {pwMsg.text && (
            <div className={`pf-msg pf-msg--${pwMsg.type}`}>{pwMsg.text}</div>
          )}
          <button type="submit" className="pf-save-btn" disabled={pwLoading}>
            {pwLoading ? <span className="pf-spinner" /> : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfileForm;