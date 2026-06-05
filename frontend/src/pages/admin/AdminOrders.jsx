// File: ./frontend/src/pages/admin/AdminOrders.jsx  (NEW)

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_FILTER_OPTIONS = ['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [shippingModal, setShippingModal] = useState(null); // orderId
  const [shippingForm, setShippingForm] = useState({ courierName: '', awbNumber: '' });
  const [shippingLoading, setShippingLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState(null); // orderId
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter !== 'all') params.status = filter;
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/admin/orders', { params });
      setOrders(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filter, search, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'shipped') {
      setShippingModal(orderId);
      setShippingForm({ courierName: '', awbNumber: '' });
      return;
    }
    if (newStatus === 'cancelled') {
      setCancelModal(orderId);
      setCancelReason('');
      return;
    }
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShippingSubmit = async () => {
    if (!shippingForm.courierName.trim() || !shippingForm.awbNumber.trim()) {
      alert('Please fill in both courier name and AWB number.');
      return;
    }
    setShippingLoading(true);
    try {
      const res = await api.patch(`/admin/orders/${shippingModal}/status`, {
        status: 'shipped',
        courierName: shippingForm.courierName.trim(),
        awbNumber: shippingForm.awbNumber.trim()
      });
      setOrders(prev => prev.map(o => o._id === shippingModal ? res.data : o));
      setShippingModal(null);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update shipping.');
    } finally {
      setShippingLoading(false);
    }
  };

  const handleAdminCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      alert('Please enter a reason for cancellation.');
      return;
    }
    setCancelLoading(true);
    try {
      const res = await api.patch(`/admin/orders/${cancelModal}/status`, {
        status: 'cancelled',
        adminCancelReason: cancelReason.trim()
      });
      setOrders(prev => prev.map(o => o._id === cancelModal ? res.data : o));
      setCancelModal(null);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleRefundStatus = async (orderId, refundStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/refund-status`, { refundStatus });
      setOrders(prev => prev.map(o =>
        o._id === orderId
          ? { ...o, cancellation: { ...o.cancellation, refundStatus } }
          : o
      ));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update refund.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <span className="admin-total-badge">{total} total</span>
      </div>

      {/* Filters */}
      <div className="ao-toolbar">
        <div className="ao-status-filters">
          {STATUS_FILTER_OPTIONS.map(s => (
            <button
              key={s}
              className={`ao-filter-btn ${filter === s ? 'ao-filter-btn--active' : ''}`}
              onClick={() => { setFilter(s); setPage(1); }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <input
          className="ao-search"
          type="text"
          placeholder="Search by order #, name or email…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders found.</div>
      ) : (
        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order._id}>
                  <tr className={expandedId === order._id ? 'ao-row--expanded' : ''}>
                    <td className="ao-order-num">{order.orderNumber}</td>
                    <td>
                      <p className="ao-customer-name">{order.customerName}</p>
                      <p className="ao-customer-email">{order.email}</p>
                    </td>
                    <td className="ao-date">{formatDate(order.createdAt)}</td>
                    <td className="ao-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                    <td>
                      <span
                        className="ao-status-badge"
                        style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '18' }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status !== 'cancelled' && order.status !== 'delivered' ? (
                        <select
                          className="ao-status-select"
                          value=""                          // always show placeholder
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          <option value="" disabled>Select a status</option>
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="ao-status-final">
                          {order.status === 'delivered' ? '✓ Delivered' : '✕ Cancelled'}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="ao-expand-btn"
                        onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      >
                        {expandedId === order._id ? 'Hide ↑' : 'View ↓'}
                      </button>
                    </td>
                  </tr>

                  {expandedId === order._id && (
                    <tr className="ao-detail-row">
                      <td colSpan={7}>
                        <div className="ao-detail">
                          <div className="ao-detail-section">
                            <h4>Items</h4>
                            {order.items?.map((item, i) => (
                              <div key={i} className="ao-item">
                                {item.product?.images?.[0] && (
                                  <img src={item.product.images[0]} alt={item.productName} className="ao-item-img" />
                                )}
                                <div>
                                  <p className="ao-item-name">{item.productName}</p>
                                  <p className="ao-item-meta">
                                    Qty: {item.quantity} · {item.sizeType === 'standard' ? `Size ${item.standardSize}` : `Custom (B:${item.customMeasurements?.bust}", W:${item.customMeasurements?.waist}")`}
                                  </p>
                                </div>
                                <span className="ao-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>

                          <div className="ao-detail-section">
                            <h4>Shipping Address</h4>
                            <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                          </div>

                          {order.utm?.source && (
                            <div className="ao-detail-section">
                              <h4>UTM / Campaign</h4>
                              <p>Source: <strong>{order.utm.source}</strong> · Medium: {order.utm.medium || '—'} · Campaign: {order.utm.campaign || '—'}</p>
                            </div>
                          )}

                          {order.shipping?.awbNumber && (
                            <div className="ao-detail-section">
                              <h4>Shipping Details</h4>
                              <p>Courier: <strong>{order.shipping.courierName}</strong></p>
                              <p>AWB Number: <strong>{order.shipping.awbNumber}</strong></p>
                              <p>Shipped On: {new Date(order.shipping.shippedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                            </div>
                          )}

                          {order.statusLogs?.length > 0 && (
                            <div className="ao-detail-section">
                              <h4>Status History</h4>
                              <div className="ao-status-log">
                                {order.statusLogs.map((log, i) => (
                                  <div key={i} className="ao-log-row">
                                    <span className="ao-log-status" style={{ color: STATUS_COLORS[log.status] }}>{log.status}</span>
                                    <span className="ao-log-date">{new Date(log.changedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                                    <span className="ao-log-by">by {log.changedBy}</span>
                                    {log.note && <span className="ao-log-note">{log.note}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {order.cancellation?.requestedAt && (
                            <div className="ao-detail-section ao-detail-section--cancellation">
                              <h4>Cancellation & Refund</h4>

                              {/* Admin-cancel: only reason, no refund info */}
                              {order.cancellation.adminCancelReason ? (
                                <>
                                  <p>Cancelled by: <strong>Admin</strong></p>
                                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                                    🔒 Admin Reason: {order.cancellation.adminCancelReason}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {/* Customer-initiated cancellation */}
                                  {order.cancellation.reason && (
                                    <p>Reason: {order.cancellation.reason}</p>
                                  )}
                                  <p>UPI ID: <strong>{order.cancellation.upiId}</strong></p>
                                  <p>Processing Fee: ₹{order.cancellation.processingFee?.toLocaleString('en-IN')}</p>
                                  <p>Refund Amount: <strong>₹{order.cancellation.refundAmount?.toLocaleString('en-IN')}</strong></p>
                                  <div className="ao-refund-status-row">
                                    <span className={`ao-refund-badge ao-refund-badge--${order.cancellation.refundStatus}`}>
                                      {order.cancellation.refundStatus}
                                    </span>
                                    {order.cancellation.refundStatus === 'pending' && (
                                      <button
                                        className="ao-mark-processed-btn"
                                        onClick={() => handleRefundStatus(order._id, 'processed')}
                                      >
                                        Mark as Processed
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ao-pagination">
          <button className="ao-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="ao-page-info">Page {page} of {totalPages}</span>
          <button className="ao-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {shippingModal && (
        <div className="ao-modal-backdrop" onClick={() => setShippingModal(null)}>
          <div className="ao-modal" onClick={e => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h3>Enter Shipping Details</h3>
              <button className="ao-modal-close" onClick={() => setShippingModal(null)}>×</button>
            </div>
            <div className="ao-modal-field">
              <label>Courier Name</label>
              <input
                type="text"
                placeholder="e.g. Delhivery, BlueDart, DTDC"
                value={shippingForm.courierName}
                onChange={e => setShippingForm(p => ({ ...p, courierName: e.target.value }))}
              />
            </div>
            <div className="ao-modal-field">
              <label>AWB / Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. 1234567890"
                value={shippingForm.awbNumber}
                onChange={e => setShippingForm(p => ({ ...p, awbNumber: e.target.value }))}
              />
            </div>
            <p className="ao-modal-note">
              Shipped date will be captured automatically as today. Customer will receive an email with these details.
            </p>
            <div className="ao-modal-actions">
              <button className="ao-btn-secondary" onClick={() => setShippingModal(null)} disabled={shippingLoading}>
                Cancel
              </button>
              <button className="ao-btn-primary" onClick={handleShippingSubmit} disabled={shippingLoading}>
                {shippingLoading ? <span className="admin-spinner" /> : 'Confirm Shipped'}
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelModal && (
        <div className="ao-modal-backdrop" onClick={() => setCancelModal(null)}>
          <div className="ao-modal" onClick={e => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h3>Cancel Order</h3>
              <button className="ao-modal-close" onClick={() => setCancelModal(null)}>×</button>
            </div>
            <p style={{ marginBottom: '12px', color: '#666', fontSize: '14px' }}>
              This action cannot be undone. Please provide a reason for cancellation (admin-only, not shown to customer).
            </p>
            <div className="ao-modal-field">
              <label>Reason for Cancellation *</label>
              <textarea
                rows={3}
                placeholder="e.g. Item out of stock, payment fraud suspected..."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
            <div className="ao-modal-actions">
              <button className="ao-btn-secondary" onClick={() => setCancelModal(null)} disabled={cancelLoading}>
                Go Back
              </button>
              <button
                className="ao-btn-primary"
                style={{ background: '#dc2626' }}
                onClick={handleAdminCancelSubmit}
                disabled={cancelLoading || !cancelReason.trim()}
              >
                {cancelLoading ? <span className="admin-spinner" /> : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;