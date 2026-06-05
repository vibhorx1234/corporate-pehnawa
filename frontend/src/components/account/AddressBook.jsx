// File: ./frontend/src/components/account/AddressBook.jsx

import React, { useState, useEffect } from 'react';
import addressService from '../../services/addressService';
import AddressForm from './AddressForm';
import './AddressBook.css';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [error, setError] = useState('');

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAll();
      setAddresses(res.data);
    } catch {
      setError('Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingAddress) {
        await addressService.update(editingAddress._id, formData);
      } else {
        await addressService.add(formData);
      }
      await fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressService.remove(id);
      setAddresses(p => p.filter(a => a._id !== id));
    } catch {
      setError('Failed to delete address.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefault(id);
      await fetchAddresses();
    } catch {
      setError('Failed to update default address.');
    }
  };

  const openEdit = (addr) => {
    setEditingAddress(addr);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (loading) return <div className="ab-loading"><span className="ab-spinner" /></div>;

  return (
    <div className="address-book">
      <div className="ab-header">
        <h3>Saved Addresses</h3>
        {!showForm && (
          <button className="ab-add-btn" onClick={() => setShowForm(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Address
          </button>
        )}
      </div>

      {error && <div className="ab-error">{error}</div>}

      {showForm && (
        <div className="ab-form-wrap">
          <h4>{editingAddress ? 'Edit Address' : 'New Address'}</h4>
          <AddressForm
            initial={editingAddress}
            onSave={handleSave}
            onCancel={closeForm}
            loading={saving}
          />
        </div>
      )}

      {!showForm && addresses.length === 0 && (
        <div className="ab-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <p>No saved addresses yet.</p>
        </div>
      )}

      {!showForm && (
        <div className="ab-list">
          {addresses.map(addr => (
            <div key={addr._id} className={`ab-card ${addr.isDefault ? 'ab-card--default' : ''}`}>
              {addr.isDefault && <span className="ab-default-tag">Default</span>}
              <div className="ab-card-label">{addr.label}</div>
              <p className="ab-card-name">{addr.recipientName}</p>
              <p className="ab-card-address">
                {addr.street}, {addr.city},<br />
                {addr.state} — {addr.pincode}
              </p>
              <p className="ab-card-phone">📞 {addr.phone}</p>
              <div className="ab-card-actions">
                <button className="ab-action-btn" onClick={() => openEdit(addr)}>Edit</button>
                {!addr.isDefault && (
                  <button className="ab-action-btn" onClick={() => handleSetDefault(addr._id)}>
                    Set Default
                  </button>
                )}
                <button className="ab-action-btn ab-action-btn--danger" onClick={() => handleDelete(addr._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBook;