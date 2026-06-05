// File: ./frontend/src/components/account/OrderHistory.jsx

import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import OrderCard from './OrderCard';
import './OrderHistory.css';

const STATUSES = ['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data);
      } catch {
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="oh-loading">
      <span className="oh-spinner" />
      <p>Loading your orders…</p>
    </div>
  );

  return (
    <div className="order-history">
      <div className="oh-header">
        <h3>Order History</h3>
        <span className="oh-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      {error && <div className="oh-error">{error}</div>}

      {orders.length > 0 && (
        <div className="oh-filters">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`oh-filter-btn ${filter === s ? 'oh-filter-btn--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="oh-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>{filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}</p>
        </div>
      ) : (
        <div className="oh-list">
          {filtered.map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;