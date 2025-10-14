// File: ./frontend/src/components/orders/CustomizationForm.jsx

import React from 'react';
import './CustomizationForm.css';

const CustomizationForm = ({ measurements, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...measurements,
      [name]: value
    });
  };

  return (
    <div className="customization-form">
      <div className="measurement-info">
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>All measurements should be in inches. Refer to the size chart for guidance on how to measure.</p>
      </div>

      <div className="measurements-grid">

        <div className="form-group">
          <label htmlFor="hips">Bust *</label>
          <input
            type="number"
            id="bust"
            name="bust"
            step="0.1"
            min="20"
            value={measurements.bust}
            onChange={handleChange}
            placeholder="e.g., 40"
            className={errors?.bust ? 'error' : ''}
          />
          {errors?.hips && <span className="error-text">{errors.bust}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="chest">Length *</label>
          <input
            type="number"
            id="length"
            name="length"
            step="0.1"
            min="20"
            value={measurements.length}
            onChange={handleChange}
            placeholder="e.g., 38.5"
            className={errors?.length ? 'error' : ''}
          />
          {errors?.chest && <span className="error-text">{errors.length}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="waist">Waist *</label>
          <input
            type="number"
            id="waist"
            name="waist"
            step="0.1"
            min="20"
            value={measurements.waist}
            onChange={handleChange}
            placeholder="e.g., 32"
            className={errors?.waist ? 'error' : ''}
          />
          {errors?.waist && <span className="error-text">{errors.waist}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="shoulder">Shoulder *</label>
          <input
            type="number"
            id="shoulder"
            name="shoulder"
            step="0.1"
            min="10"
            value={measurements.shoulder}
            onChange={handleChange}
            placeholder="e.g., 17"
            className={errors?.shoulder ? 'error' : ''}
          />
          {errors?.shoulder && <span className="error-text">{errors.shoulder}</span>}
        </div>
      </div>
    </div>
  );
};

export default CustomizationForm;