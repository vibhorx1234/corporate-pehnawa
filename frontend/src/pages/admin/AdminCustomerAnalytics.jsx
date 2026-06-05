// File: ./frontend/src/pages/admin/AdminCustomerAnalytics.jsx  (NEW)

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';
import './AdminAnalytics.css';

const PERIODS = [
  { label: '7 days',  value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year',  value: '1y' },
];

const AdminCustomerAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/analytics/customers', { params: { period } })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /></div>;
  if (!data) return <div className="admin-error">Failed to load analytics.</div>;

  const {
    totalCustomers, newCustomers, conversionRate,
    returningCustomers, newVsReturning,
    registrationsByDay, topCustomers
  } = data;

  const maxReg = Math.max(...(registrationsByDay.map(d => d.count)), 1);
  const returningPct = totalCustomers > 0
    ? ((returningCustomers / totalCustomers) * 100).toFixed(1)
    : 0;

  return (
    <div className="admin-analytics">
      <div className="admin-page-header">
        <h1>Customer Analytics</h1>
        <div className="period-selector">
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={`ao-filter-btn ${period === p.value ? 'ao-filter-btn--active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="stat-grid">
        <div className="stat-card stat-card--blue">
          <p className="stat-label">Total Customers</p>
          <p className="stat-value">{totalCustomers?.toLocaleString('en-IN')}</p>
          <p className="stat-sub">{newCustomers} new in period</p>
        </div>
        <div className="stat-card stat-card--green">
          <p className="stat-label">Conversion Rate</p>
          <p className="stat-value">{conversionRate}%</p>
          <p className="stat-sub">Registered → placed order</p>
        </div>
        <div className="stat-card stat-card--orange">
          <p className="stat-label">Returning Customers</p>
          <p className="stat-value">{returningCustomers?.toLocaleString('en-IN')}</p>
          <p className="stat-sub">{returningPct}% of total</p>
        </div>
        <div className="stat-card stat-card--amber">
          <p className="stat-label">New Customers</p>
          <p className="stat-value">{newVsReturning.new?.toLocaleString('en-IN')}</p>
          <p className="stat-sub">First-time buyers</p>
        </div>
      </div>

      {/* New vs Returning visual */}
      <div className="analytics-card">
        <h3>New vs Returning Customers</h3>
        <div className="nr-chart">
          <div className="nr-bar-wrap">
            <div
              className="nr-bar nr-bar--new"
              style={{ flex: newVsReturning.new || 1 }}
              title={`New: ${newVsReturning.new}`}
            >
              <span>New ({newVsReturning.new})</span>
            </div>
            <div
              className="nr-bar nr-bar--returning"
              style={{ flex: returningCustomers || 1 }}
              title={`Returning: ${returningCustomers}`}
            >
              <span>Returning ({returningCustomers})</span>
            </div>
          </div>
          <p className="analytics-sub">
            A returning customer rate above 20% indicates strong brand loyalty.
            Current rate: <strong>{returningPct}%</strong>
          </p>
        </div>
      </div>

      {/* New registrations over time */}
      <div className="analytics-card">
        <h3>New Registrations by Day</h3>
        {registrationsByDay.length === 0 ? (
          <p className="analytics-empty">No registrations in this period.</p>
        ) : (
          <div className="bar-chart">
            {registrationsByDay.map(d => (
              <div key={d._id} className="bar-col">
                <span className="bar-value">{d.count}</span>
                <div
                  className="bar-fill bar-fill--blue"
                  style={{ height: `${Math.max(4, (d.count / maxReg) * 140)}px` }}
                  title={`${d.count} new registrations on ${d._id}`}
                />
                <span className="bar-label">{d._id.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top customers */}
      <div className="analytics-card">
        <h3>Top Customers by Spend</h3>
        {topCustomers.length === 0 ? (
          <p className="analytics-empty">No customer order data yet.</p>
        ) : (
          <table className="ao-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spend</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr key={c._id}>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                  <td className="ao-customer-email" style={{ margin: 0 }}>{c.email}</td>
                  <td>{c.orderCount}</td>
                  <td className="ao-amount">₹{c.totalSpend?.toLocaleString('en-IN')}</td>
                  <td className="ao-date">
                    {new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCustomerAnalytics;