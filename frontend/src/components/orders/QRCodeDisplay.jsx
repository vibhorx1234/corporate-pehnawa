// File: ./frontend/src/components/orders/QRCodeDisplay.jsx

import React from 'react';
import { formatPrice } from '../../utils/helpers';
import './QRCodeDisplay.css';
import qrcode from '../../assets/images/qr-code.png';

const QRCodeDisplay = ({ amount }) => {
  // Replace with your actual UPI QR code image path
  const qrCodePath = qrcode;
  const upiId = '6377223179@pthdfc'; // Replace with actual UPI ID

  return (
    <div className="qr-code-display">
      <h4 className="qr-title">Scan to Pay</h4>
      <p className="qr-subtitle">Pay {formatPrice(amount)} using any UPI app</p>

      <div className="qr-code-container">
        <div className="qr-code-wrapper">
          <img 
            src={qrCodePath} 
            alt="UPI QR Code" 
            className="qr-code-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback if QR image not available */}
          <div className="qr-code-placeholder" style={{ display: 'none' }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p>QR Code</p>
          </div>
        </div>

        <div className="qr-info">
          <div className="info-item">
            <span className="info-label">UPI ID:</span>
            <span className="info-value">{upiId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Amount:</span>
            <span className="info-value amount">{formatPrice(amount)}</span>
          </div>
        </div>
      </div>

      <div className="payment-instructions">
        <h5>Payment Instructions:</h5>
        <ol>
          <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
          <li>Scan the QR code above</li>
          <li>Verify the amount and complete the payment</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeDisplay;