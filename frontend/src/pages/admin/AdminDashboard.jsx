import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

const StatCard = ({ label, value, sub, trend, color }) => (
  <div className={`stat-card stat-card--${color || 'default'}`}>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
    {sub && <p className="stat-sub">{sub}</p>}
    {trend !== undefined && trend !== null && (
      <p className={`stat-trend ${parseFloat(trend) >= 0 ? 'stat-trend--up' : 'stat-trend--down'}`}>
        {parseFloat(trend) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(trend))}% vs last month
      </p>
    )}
  </div>
);

const GA4Section = () => {
  const [ga4, setGa4] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/analytics/ga4?period=${period}`)
      .then(res => setGa4(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load GA4 data.'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="ga4-section">
      <div className="ga4-header">
        <h2>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Traffic Analytics — GA4
        </h2>
        <div className="ga4-period-tabs">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              className={`ao-filter-btn ${period === p ? 'ao-filter-btn--active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="admin-loading"><span className="admin-spinner" /></div>}
      {error && <div className="ga4-error">⚠️ {error}</div>}

      {!loading && !error && ga4 && (
        <>
          {/* Overview KPIs */}
          <div className="ga4-kpi-grid">
            {[
              { label: 'Sessions', value: ga4.overview.sessions?.toLocaleString() },
              { label: 'Total Users', value: ga4.overview.totalUsers?.toLocaleString() },
              { label: 'New Users', value: ga4.overview.newUsers?.toLocaleString() },
              { label: 'Page Views', value: ga4.overview.pageViews?.toLocaleString() },
              { label: 'Bounce Rate', value: `${ga4.overview.bounceRate}%` },
              { label: 'Avg. Session', value: `${Math.floor(ga4.overview.avgSessionDuration / 60)}m ${ga4.overview.avgSessionDuration % 60}s` },
            ].map(kpi => (
              <div key={kpi.label} className="ga4-kpi-card">
                <p className="stat-label">{kpi.label}</p>
                <p className="stat-value">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="ga4-bottom-grid">

            {/* Daily sessions chart */}
            <div className="ga4-card">
              <h4>Daily Sessions</h4>
              <div className="ga4-bar-chart">
                {ga4.daily.map(d => {
                  const max = Math.max(...ga4.daily.map(x => x.sessions));
                  const pct = max > 0 ? (d.sessions / max) * 100 : 0;
                  return (
                    <div key={d.date} className="ga4-bar-col" title={`${d.date}: ${d.sessions} sessions`}>
                      <div className="ga4-bar" style={{ height: `${pct}%` }} />
                      <span className="ga4-bar-label">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device breakdown */}
            <div className="ga4-card">
              <h4>Device Breakdown</h4>
              <div className="ga4-list">
                {ga4.devices.map(d => {
                  const total = ga4.devices.reduce((s, x) => s + x.sessions, 0);
                  const pct = total > 0 ? ((d.sessions / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={d.device} className="ga4-list-row">
                      <span className="ga4-list-label">{d.device}</span>
                      <div className="ga4-list-bar-wrap">
                        <div className="ga4-list-bar" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="ga4-list-value">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top cities */}
            <div className="ga4-card">
              <h4>Traffic by City</h4>
              <div className="ga4-list">
                {ga4.cities.map(c => (
                  <div key={c.city} className="ga4-list-row">
                    <span className="ga4-list-label">{c.city}</span>
                    <span className="ga4-list-value">{c.sessions?.toLocaleString()} sessions</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top pages */}
            <div className="ga4-card">
              <h4>Top Pages</h4>
              <div className="ga4-list">
                {ga4.pages.map(p => (
                  <div key={p.path} className="ga4-list-row">
                    <span className="ga4-list-label ga4-list-label--mono">{p.path}</span>
                    <span className="ga4-list-value">{p.views?.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /></div>;
  if (!data) return <div className="admin-error">Failed to load dashboard.</div>;

  const { orders, revenue, customers, carts } = data;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p className="admin-page-sub">Welcome back, Admin</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Revenue" value={`₹${revenue.total?.toLocaleString('en-IN')}`} sub={`₹${revenue.thisMonth?.toLocaleString('en-IN')} this month`} trend={revenue.growth} color="orange" />
        <StatCard label="Orders Today" value={orders.today} sub={`${orders.thisMonth} this month`} color="blue" />
        <StatCard label="Total Customers" value={customers.total?.toLocaleString('en-IN')} sub={`${customers.newToday} new today`} color="green" />
        <StatCard label="Delivered Orders" value={orders.delivered} sub="Completed orders" color="green" />
        <StatCard label="Abandoned Carts" value={carts.abandoned} sub="Carts with items" color="red" />
      </div>

      <div className="admin-quick-links">
        <h2>Quick Actions</h2>
        <div className="quick-links-grid">
          {[
            { label: 'Manage Orders', path: '/admin/orders', icon: '📦', desc: 'View, filter & update order statuses' },
            { label: 'Customer List', path: '/admin/customers', icon: '👥', desc: 'Browse and search all customers' },
            { label: 'Abandoned Carts', path: '/admin/abandoned-carts', icon: '🛒', desc: 'View carts with unpurchased items' },
            { label: 'Revenue Analytics', path: '/admin/analytics/revenue', icon: '📊', desc: 'Revenue, products, UTM sources' },
            { label: 'Customer Analytics', path: '/admin/analytics/customers', icon: '📈', desc: 'Conversion, retention, top spenders' },
          ].map(link => (
            <Link key={link.path} to={link.path} className="quick-link-card">
              <span className="ql-icon">{link.icon}</span>
              <div>
                <p className="ql-label">{link.label}</p>
                <p className="ql-desc">{link.desc}</p>
              </div>
              <span className="ql-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      <GA4Section />
    </div>
  );
};

export default AdminDashboard;