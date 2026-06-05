// File: ./frontend/src/components/account/OrderCard.jsx  (MODIFIED)
// Changes: Added "Cancel Order" button for eligible orders, opens CancelOrderModal

import React, { useState } from 'react';
import CancelOrderModal from './CancelOrderModal';
import './OrderCard.css';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  processing: { label: 'Processing', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  shipped: { label: 'Shipped', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  delivered: { label: 'Delivered', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
};

// Orders are cancellable only before shipping
const CANCELLABLE_STATUSES = ['confirmed'];

const OrderCard = ({ order: initialOrder }) => {
  const [order, setOrder] = useState(initialOrder);
  const [expanded, setExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  console.log('order data received:', order.shipping, order.status);

  const status = STATUS_CONFIG[order.status];
  const address = order.shippingAddress || order.address || {};
  const canCancel = CANCELLABLE_STATUSES.includes(order.status) &&
    (Date.now() - new Date(order.createdAt).getTime()) < 24 * 60 * 60 * 1000;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const handleCancelled = (orderId) => {
    // Update local state immediately so UI reflects cancellation
    setOrder(prev => ({
      ...prev,
      status: 'cancelled',
      cancellation: {
        ...prev.cancellation,
        refundStatus: 'pending'
      }
    }));
    setShowCancelModal(false);
  };

  return (
    <>
      <div className="order-card">
        <div className="order-card-header">
          <div className="order-meta">
            <span className="order-number">#{order.orderNumber}</span>
            <span className="order-date">{formatDate(order.createdAt)}</span>
          </div>
          <div className="order-header-right">
            <span
              className="order-status-badge"
              style={{ color: status.color, background: status.bg }}
            >
              {status.label}
            </span>
            <span className="order-total">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Cancellation refund info */}
        {order.status === 'cancelled' && order.cancellation?.upiId && (
          <div className="order-refund-notice">
            <div>
              <p className="orn-title">
                Refund of ₹{order.cancellation.refundAmount?.toLocaleString('en-IN')} — {' '}
                <span className={`orn-status orn-status--${order.cancellation.refundStatus}`}>
                  {order.cancellation.refundStatus === 'pending' ? 'Processing (within 24hrs)' : 'Processed ✓'}
                </span>
              </p>
              <p className="orn-upi">To: {order.cancellation.upiId}</p>
              {order.cancellation.reason && (
                <p className="orn-reason">Reason: {order.cancellation.reason}</p>
              )}
            </div>
          </div>
        )}

        {/* Items preview */}
        <div className="order-items-preview">
          {(order.items || []).map((item, i) => (
            <div key={item._id || i} className="order-item-preview">
              {item.product?.images?.[0] && (
                <img src={item.product.images[0]} alt={item.productName} className="order-item-thumb" />
              )}
              <div className="order-item-info">
                <span className="order-item-name">{item.productName}</span>
                <span className="order-item-meta">
                  Qty: {item.quantity} · {item.sizeType === 'standard'
                    ? `Size ${item.standardSize}`
                    : `Custom — Bust: ${item.customMeasurements?.bust}", Waist: ${item.customMeasurements?.waist}"`}
                </span>
                <span className="order-item-meta">₹{item.price?.toLocaleString('en-IN')} / piece</span>
              </div>
              <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        {order.status === 'shipped' && order.shipping?.awbNumber && (
          <div className="order-shipping-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 5v3h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div className="osb-content">
              <span className="osb-title">Your order is on the way!</span>
              <span className="osb-meta">{order.shipping.courierName} · AWB: <strong>{order.shipping.awbNumber}</strong></span>
              <span className="osb-date">Shipped on {new Date(order.shipping.shippedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        )}

        <div className="order-card-actions-row">
          <button className="order-expand-btn" onClick={() => setExpanded(p => !p)}>
            {expanded ? 'Hide details ↑' : 'View details ↓'}
          </button>
          {canCancel && (
            <button
              className="order-cancel-btn"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Order
            </button>
          )}
        </div>

        {expanded && (
          <div className="order-details-expanded">
            <div className="order-detail-section">
              <h5>Delivery Address</h5>
              <p className="order-address-text">
                {address.street}, {address.city},<br />
                {address.state} — {address.pincode}, {address.country || 'India'}
              </p>
            </div>

            {order.shipping?.awbNumber && (
              <div className="order-detail-section">
                <h5>Shipping Details</h5>
                <div className="order-shipping-info">
                  <div className="osi-row">
                    <span className="osi-label">Courier</span>
                    <span className="osi-value">{order.shipping.courierName}</span>
                  </div>
                  <div className="osi-row">
                    <span className="osi-label">AWB / Tracking</span>
                    <span className="osi-value osi-awb">{order.shipping.awbNumber}</span>
                  </div>
                  <div className="osi-row">
                    <span className="osi-label">Shipped On</span>
                    <span className="osi-value">{new Date(order.shipping.shippedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )}

            {order.notes && (
              <div className="order-detail-section">
                <h5>Notes</h5>
                <p className="order-notes-text">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showCancelModal && (
        <CancelOrderModal
          order={order}
          onClose={() => setShowCancelModal(false)}
          onCancelled={handleCancelled}
        />
      )}
    </>
  );
};

export default OrderCard;