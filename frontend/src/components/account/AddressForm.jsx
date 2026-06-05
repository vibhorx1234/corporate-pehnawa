// File: ./frontend/src/components/account/AddressForm.jsx

import React, { useState, useEffect } from 'react';
import './AddressForm.css';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh'
];

const empty = { label: 'Home', recipientName: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false };

const AddressForm = ({ initial = null, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial ? { ...initial } : { ...empty });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...empty });
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.recipientName?.trim()) e.recipientName = 'Name is required.';
    if (!form.phone?.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile number required.';
    if (!form.street?.trim()) e.street = 'Street address is required.';
    if (!form.city?.trim()) e.city = 'City is required.';
    if (!form.state?.trim()) e.state = 'State is required.';
    if (!form.pincode?.trim() || !/^[1-9][0-9]{5}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <div className="address-form-row">
        <div className="af-group">
          <label>Label</label>
          <select name="label" value={form.label} onChange={handleChange}>
            {['Home', 'Work', 'Other'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="af-group">
          <label>Recipient Name *</label>
          <input name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="Full name" />
          {errors.recipientName && <span className="af-error">{errors.recipientName}</span>}
        </div>
      </div>

      <div className="af-group">
        <label>Phone Number *</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" type="tel" />
        {errors.phone && <span className="af-error">{errors.phone}</span>}
      </div>

      <div className="af-group">
        <label>Street Address *</label>
        <input name="street" value={form.street} onChange={handleChange} placeholder="Flat / House no., Building, Street" />
        {errors.street && <span className="af-error">{errors.street}</span>}
      </div>

      <div className="address-form-row">
        <div className="af-group">
          <label>City *</label>
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
          {errors.city && <span className="af-error">{errors.city}</span>}
        </div>
        <div className="af-group">
          <label>State *</label>
          <select name="state" value={form.state} onChange={handleChange}>
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <span className="af-error">{errors.state}</span>}
        </div>
      </div>

      <div className="address-form-row">
        <div className="af-group">
          <label>Pincode *</label>
          <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
          {errors.pincode && <span className="af-error">{errors.pincode}</span>}
        </div>
        <div className="af-group">
          <label>Country</label>
          <input name="country" value={form.country || 'India'} onChange={handleChange} disabled />
        </div>
      </div>

      <label className="af-checkbox">
        <input type="checkbox" name="isDefault" checked={!!form.isDefault} onChange={handleChange} />
        Set as default address
      </label>

      <div className="af-actions">
        <button type="button" className="af-btn af-btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="af-btn af-btn-primary" disabled={loading}>
          {loading ? <span className="btn-spinner-sm" /> : initial ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;