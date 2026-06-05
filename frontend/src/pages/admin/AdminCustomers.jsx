// File: ./frontend/src/pages/admin/AdminCustomers.jsx  (NEW)

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers', { params: { page, limit: 20, search: search.trim() || undefined } });
      setCustomers(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const openCustomer = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/customers/${id}`);
      setSelectedCustomer(res.data);
    } catch (e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1>Customers</h1>
        <span className="admin-total-badge">{total} total</span>
      </div>

      <div className="ao-toolbar">
        <input
          className="ao-search"
          type="text"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /></div>
      ) : (
        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Total Spend</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id}>
                  <td className="ao-customer-name" style={{ margin: 0 }}>{c.name}</td>
                  <td className="ao-customer-email" style={{ margin: 0, fontSize: 'var(--text-sm)' }}>{c.email}</td>
                  <td className="ao-date">{c.phone || '—'}</td>
                  <td className="ao-date">{formatDate(c.createdAt)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.orderCount}</td>
                  <td className="ao-amount">₹{c.totalSpend?.toLocaleString('en-IN')}</td>
                  <td>
                    <button className="ao-expand-btn" onClick={() => openCustomer(c._id)}>
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="ao-pagination">
          <button className="ao-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="ao-page-info">Page {page} of {totalPages}</span>
          <button className="ao-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Customer detail drawer */}
      {selectedCustomer && (
        <div className="cancel-modal-backdrop" onClick={() => setSelectedCustomer(null)}>
          <div className="cancel-modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <div className="admin-loading"><span className="admin-spinner" /></div>
            ) : (
              <>
                <div className="cm-header">
                  <h3>{selectedCustomer.user.name}</h3>
                  <button className="cm-close" onClick={() => setSelectedCustomer(null)}>×</button>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{selectedCustomer.user.email} · {selectedCustomer.user.phone || 'No phone'}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>Member since {formatDate(selectedCustomer.user.createdAt)}</p>

                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 'var(--spacing-sm)' }}>
                    Order History ({selectedCustomer.orders.length})
                  </h4>
                  {selectedCustomer.orders.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>No orders yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', maxHeight: 360, overflowY: 'auto' }}>
                      {selectedCustomer.orders.map(o => (
                        <div key={o._id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 'var(--text-xs)', fontWeight: 700 }}>#{o.orderNumber}</span>
                            <span className="ao-status-badge" style={{ color: '#666', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>{o.status}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{formatDate(o.createdAt)}</span>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary-orange)' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;