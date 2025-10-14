// File: ./frontend/src/components/orders/OrderForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { validateOrderForm } from '../../utils/validation';
import CustomizationForm from './CustomizationForm';
import QRCodeDisplay from './QRCodeDisplay';
import FileUpload from './FileUpload';
import SizeChart from '../products/SizeChart';
import { SIZES, SIZE_TYPE } from '../../utils/constants';
import './OrderForm.css';

const OrderForm = ({ product }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    product: product._id,
    productName: product.name,
    quantity: 1,
    sizeType: SIZE_TYPE.STANDARD,
    standardSize: '',
    customMeasurements: {
      bust: '',
      length: '',
      waist: '',
      shoulder: ''
    },
    totalAmount: product.discountedPrice || product.price,
    paymentScreenshot: null,
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 1;
    const price = product.discountedPrice || product.price;
    setFormData(prev => ({
      ...prev,
      quantity,
      totalAmount: price * quantity
    }));
  };

  const handleSizeTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      sizeType: e.target.value,
      standardSize: '',
      customMeasurements: {
        bust: '',
        length: '',
        waist: '',
        shoulder: ''
      }
    }));
  };

  const handleCustomMeasurementChange = (measurements) => {
    setFormData(prev => ({
      ...prev,
      customMeasurements: measurements
    }));
  };

  const handleFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: file
    }));
    if (errors.paymentScreenshot) {
      setErrors(prev => ({ ...prev, paymentScreenshot: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateOrderForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const response = await createOrder(formData);
      
      setSuccessMessage(`Order placed successfully! Your order number is ${response.data.orderNumber}`);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to place order. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="success-container">
        <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>Order Placed Successfully!</h3>
        <p>{successMessage}</p>
        <p className="redirect-message">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="error-alert">
          {errors.submit}
        </div>
      )}

      {/* Customer Information */}
      <div className="form-section">
        <h3 className="form-section-title">Customer Information</h3>
        
        <div className="form-group">
          <label htmlFor="customerName">Full Name *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className={errors.customerName ? 'error' : ''}
          />
          {errors.customerName && <span className="error-text">{errors.customerName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="10-digit number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="form-section">
        <h3 className="form-section-title">Delivery Address</h3>
        
        <div className="form-group">
          <label htmlFor="street">Street Address *</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            className={errors.street ? 'error' : ''}
          />
          {errors.street && <span className="error-text">{errors.street}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.address.state}
              onChange={handleAddressChange}
              className={errors.state ? 'error' : ''}
            />
            {errors.state && <span className="error-text">{errors.state}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.address.pincode}
              onChange={handleAddressChange}
              placeholder="6-digit pincode"
              className={errors.pincode ? 'error' : ''}
            />
            {errors.pincode && <span className="error-text">{errors.pincode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.address.country}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="form-section">
        <h3 className="form-section-title">Order Details</h3>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleQuantityChange}
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <span className="error-text">{errors.quantity}</span>}
        </div>
      </div>

      {/* Size Selection */}
      <div className="form-section">
        <div className="size-section-header">
          <h3 className="form-section-title">Size Selection</h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSizeChart(true)}
          >
            View Size Chart
          </button>
        </div>

        <div className="size-type-selection">
          <label className="radio-label">
            <input
              type="radio"
              name="sizeType"
              value={SIZE_TYPE.STANDARD}
              checked={formData.sizeType === SIZE_TYPE.STANDARD}
              onChange={handleSizeTypeChange}
            />
            <span>Standard Size</span>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="sizeType"
              value={SIZE_TYPE.CUSTOM}
              checked={formData.sizeType === SIZE_TYPE.CUSTOM}
              onChange={handleSizeTypeChange}
            />
            <span>Custom Measurements</span>
          </label>
        </div>

        {formData.sizeType === SIZE_TYPE.STANDARD ? (
          <div className="form-group">
            <label htmlFor="standardSize">Select Size *</label>
            <select
              id="standardSize"
              name="standardSize"
              value={formData.standardSize}
              onChange={handleInputChange}
              className={errors.standardSize ? 'error' : ''}
            >
              <option value="">Choose size</option>
              {SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {errors.standardSize && <span className="error-text">{errors.standardSize}</span>}
          </div>
        ) : (
          <CustomizationForm
            measurements={formData.customMeasurements}
            onChange={handleCustomMeasurementChange}
            errors={errors}
          />
        )}
      </div>

      {/* Payment */}
      <div className="form-section">
        <h3 className="form-section-title">Payment</h3>
        
        <QRCodeDisplay amount={formData.totalAmount} />
        
        <FileUpload
          onFileSelect={handleFileChange}
          error={errors.paymentScreenshot}
        />
      </div>

      {/* Additional Notes */}
      <div className="form-section">
        <h3 className="form-section-title">Additional Notes (Optional)</h3>
        <div className="form-group">
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any special instructions or requirements..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary btn-lg submit-btn"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>

      {/* Size Chart Modal */}
      <SizeChart isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />
    </form>
  );
};

export default OrderForm;