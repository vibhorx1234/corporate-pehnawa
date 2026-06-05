// File: ./frontend/src/components/account/CancelOrderModal.jsx  (NEW)

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './CancelOrderModal.css';

const PROCESSING_FEE_PERCENT = 2;

const CancelOrderModal = ({ order, onClose, onCancelled }) => {
  const [upiId, setUpiId] = useState('');
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [step, setStep] = useState('confirm'); // 'confirm' | 'upi' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processingFee = parseFloat((order.totalAmount * PROCESSING_FEE_PERCENT / 100).toFixed(2));
  const refundAmount = parseFloat((order.totalAmount - processingFee).toFixed(2));

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const deadline = new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000;
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [order.createdAt]);

  const validateUpi = (id) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(id.trim());

  const handleCancel = async () => {
    if (!validateUpi(upiId)) {
      setError('Please enter a valid UPI ID (e.g. name@upi or number@bank).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post(`/orders/${order._id}/cancel`, {
        reason: reason === 'Other' ? otherReason.trim() : reason,
        upiId: upiId.trim()
      });
      setStep('success');
      if (onCancelled) onCancelled(order._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cancel-modal-backdrop"
      onClick={onClose}
      onWheel={e => e.stopPropagation()}
      onTouchMove={e => e.stopPropagation()}
    >
      <div className="cancel-modal" onClick={e => e.stopPropagation()}>

        {step === 'success' ? (
          <>
            <div className="cm-success-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>Cancellation Confirmed</h3>
            <p className="cm-success-text">
              Your refund of <strong>₹{refundAmount.toLocaleString('en-IN')}</strong> will be
              credited to <strong>{upiId}</strong> within <strong>24 hours</strong>.
            </p>
            <button className="cm-btn cm-btn-primary" onClick={onClose}>Done</button>
          </>
        ) : (
          <>
            <div className="cm-header">
              <h3>Cancel Order</h3>
              <button className="cm-close" onClick={onClose} aria-label="Close">×</button>
            </div>

            <div className="cm-order-ref">
              Order <span className="cm-order-num">#{order.orderNumber}</span>
            </div>

            {/* Refund breakdown */}
            <div className="cm-refund-box">
              <div className="cm-refund-row">
                <span>Order amount</span>
                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="cm-refund-row cm-refund-fee">
                <span>Processing fee (2%)</span>
                <span>− ₹{processingFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="cm-refund-divider" />
              <div className="cm-refund-row cm-refund-total">
                <span>You will receive</span>
                <span className="cm-refund-amount">₹{refundAmount.toLocaleString('en-IN')}</span>
              </div>
              <p className="cm-refund-note">
                Refund will be processed to your UPI ID within <strong>24 hours </strong>
                of cancellation confirmation.
              </p>
              <div className="cm-cancel-window">
                Cancellation window closes in: <span className="cm-countdown">{timeLeft}</span>
              </div>
            </div>

            {/* UPI input */}
            <div className="cm-field">
              <label>Your UPI ID for refund *</label>
              <input
                type="text"
                value={upiId}
                onChange={e => { setUpiId(e.target.value); setError(''); }}
                placeholder="e.g. yourname@upi or 9876543210@paytm"
                autoComplete="off"
              />
              <span className="cm-field-hint">
                The refund amount will be sent to this UPI ID.
              </span>
            </div>

            {/* Reason (optional) */}
            <div className="cm-field">
              <label>Reason for cancellation <span className="cm-optional">(optional)</span></label>
              <select value={reason} onChange={e => setReason(e.target.value)}>
                <option value="">Select a reason</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Found a better price">Found a better price</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery taking too long">Delivery taking too long</option>
                <option value="Other">Other</option>
              </select>
              {reason === 'Other' && (
                <textarea
                  className="cm-other-reason"
                  value={otherReason}
                  onChange={e => setOtherReason(e.target.value)}
                  placeholder="Please describe your reason…"
                  rows={3}
                />
              )}
            </div>

            {error && <div className="cm-error">{error}</div>}

            <div className="cm-warning">
              ⚠️ This action cannot be undone. The order will be permanently cancelled.
            </div>

            <div className="cm-actions">
              <button className="cm-btn cm-btn-secondary" onClick={onClose} disabled={loading}>
                Keep Order
              </button>
              <button
                className="cm-btn cm-btn-danger"
                onClick={handleCancel}
                disabled={loading || !upiId.trim() || (reason === 'Other' && !otherReason.trim())}
              >
                {loading ? <span className="cm-spinner" /> : 'Confirm Cancellation'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CancelOrderModal;