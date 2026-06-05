// File: ./frontend/src/pages/admin/AdminAbandonedCarts.jsx  (NEW)

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';
import './AdminAnalytics.css';

const AdminAbandonedCarts = () => {
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/abandoned-carts', { params: { page, limit: 20 } })
      .then(res => { setCarts(res.data); setTotal(res.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const formatDate = (d) => {
    const diff = Math.floor((Date.now() - new Date(d)) / (1000 * 60 * 60));
    if (diff < 24) return `${diff}h ago`;
    const days = Math.floor(diff / 24);
    return `${days}d ago`;
  };

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1>Abandoned Carts</h1>
        <span className="admin-total-badge">{total} active carts</span>
      </div>

      <p className="analytics-sub" style={{ marginBottom: 'var(--spacing-lg)' }}>
        Carts with items where the customer has not placed an order.
      </p>

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /></div>
      ) : carts.length === 0 ? (
        <div className="admin-empty">No abandoned carts found.</div>
      ) : (
        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Cart Value</th>
                <th>Last Updated</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {carts.map(cart => (
                <React.Fragment key={cart._id}>
                  <tr>
                    <td>
                      {cart.user ? (
                        <>
                          <p className="ao-customer-name">{cart.user.name}</p>
                          <p className="ao-customer-email">{cart.user.email}</p>
                        </>
                      ) : (
                        <p className="ao-customer-email">Guest</p>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
                    </td>
                    <td className="ao-amount">₹{cart.subtotal?.toLocaleString('en-IN')}</td>
                    <td className="ao-date">{formatDate(cart.updatedAt)}</td>
                    <td>
                      <button
                        className="ao-expand-btn"
                        onClick={() => setExpandedId(expandedId === cart._id ? null : cart._id)}
                      >
                        {expandedId === cart._id ? 'Hide ↑' : 'View ↓'}
                      </button>
                    </td>
                  </tr>

                  {expandedId === cart._id && (
                    <tr>
                      <td colSpan={5} style={{ padding: 0, borderBottom: '1px solid var(--border-color)' }}>
                        <div className="ao-detail">
                          <div className="ao-detail-section" style={{ gridColumn: '1 / -1' }}>
                            <h4>Cart Items</h4>
                            {cart.items.map((item, i) => (
                              <div key={i} className="ao-item">
                                {(item.product?.images?.[0] || item.productImage) && (
                                  <img
                                    src={item.product?.images?.[0] || item.productImage}
                                    alt={item.productName}
                                    className="ao-item-img"
                                  />
                                )}
                                <div>
                                  <p className="ao-item-name">{item.productName}</p>
                                  <p className="ao-item-meta">
                                    Qty: {item.quantity} ·{' '}
                                    {item.sizeType === 'standard'
                                      ? `Size ${item.standardSize}`
                                      : `Custom (B:${item.customMeasurements?.bust}", W:${item.customMeasurements?.waist}")`
                                    }
                                  </p>
                                </div>
                                <span className="ao-item-price">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
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

      {total > 20 && (
        <div className="ao-pagination">
          <button className="ao-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="ao-page-info">Page {page}</span>
          <button className="ao-page-btn" disabled={carts.length < 20} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default AdminAbandonedCarts;