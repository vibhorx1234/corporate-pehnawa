// File: ./frontend/src/pages/admin/AdminRevenueAnalytics.jsx  (NEW)

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';
import './AdminAnalytics.css';

const PERIODS = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
];

const AdminRevenueAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [utmForm, setUtmForm] = useState({ product: '', source: '', medium: '', campaign: '' });
  const [products, setProducts] = useState([]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const UTM_SOURCES = ['instagram', 'facebook', 'youtube', 'google', 'whatsapp', 'email', 'other'];
  const UTM_MEDIUMS = ['social', 'paid', 'organic', 'referral', 'email', 'direct'];

  useEffect(() => {
    setLoading(true);
    api.get('/admin/analytics/revenue', { params: { period } })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
  api.get('/products')
    .then(res => {
      console.log('products res:', res); // check shape in console, remove later
      const list = Array.isArray(res) ? res
        : Array.isArray(res.products) ? res.products
        : Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.products) ? res.data.products
        : [];
      setProducts(list);
    })
    .catch(() => setProducts([]));
}, []);

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /></div>;
  if (!data) return <div className="admin-error">Failed to load analytics.</div>;

  const { summary, daily, byProduct, byUTM, statusBreakdown, cancellations } = data;

  // Build simple bar chart data
  const maxRevenue = Math.max(...(daily.map(d => d.revenue)), 1);

  const handleGenerateUrl = () => {
    if (!utmForm.product || !utmForm.source || !utmForm.medium || !utmForm.campaign.trim()) return;
    const base = `${window.location.origin}/product/${utmForm.product}`;
    const url = `${base}?utm_source=${utmForm.source}&utm_medium=${utmForm.medium}&utm_campaign=${utmForm.campaign.trim().toLowerCase().replace(/\s+/g, '-')}`;
    setGeneratedUrl(url);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="admin-analytics">
      <div className="admin-page-header">
        <h1>Revenue Analytics</h1>
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

      {/* Summary cards */}
      <div className="stat-grid">
        <div className="stat-card stat-card--orange">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">₹{summary.total?.toLocaleString('en-IN') || 0}</p>
          <p className="stat-sub">{summary.count || 0} orders</p>
        </div>
        <div className="stat-card stat-card--green">
          <p className="stat-label">Avg. Order Value</p>
          <p className="stat-value">
            ₹{summary.count > 0 ? Math.round(summary.total / summary.count).toLocaleString('en-IN') : 0}
          </p>
        </div>
        <div className="stat-card stat-card--red">
          <p className="stat-label">Cancellations</p>
          <p className="stat-value">{cancellations.totalCancelled}</p>
          <p className="stat-sub">₹{cancellations.totalFees?.toLocaleString('en-IN')} in processing fees</p>
        </div>
        <div className="stat-card stat-card--amber">
          <p className="stat-label">Refunds Issued</p>
          <p className="stat-value">₹{cancellations.totalRefunded?.toLocaleString('en-IN') || 0}</p>
        </div>
      </div>

      {/* Daily revenue chart */}
      <div className="analytics-card">
        <h3>Daily Revenue</h3>
        {daily.length === 0 ? (
          <p className="analytics-empty">No data for this period.</p>
        ) : (
          <div className="bar-chart">
            {daily.map(d => (
              <div key={d._id} className="bar-col">
                <span className="bar-value">₹{Math.round(d.revenue / 1000)}k</span>
                <div
                  className="bar-fill"
                  style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 140)}px` }}
                  title={`₹${d.revenue?.toLocaleString('en-IN')} · ${d.orders} orders`}
                />
                <span className="bar-label">{d._id.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order status breakdown */}
      <div className="analytics-card">
        <h3>Order Status Breakdown</h3>
        <div className="breakdown-list">
          {statusBreakdown.map(s => (
            <div key={s._id} className="breakdown-row">
              <span className="breakdown-label">{s._id}</span>
              <span className="breakdown-count">{s.count} orders</span>
              <span className="breakdown-value">₹{s.revenue?.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="analytics-card">
        <h3>Revenue by Product</h3>
        {byProduct.length === 0 ? (
          <p className="analytics-empty">No product data.</p>
        ) : (
          <table className="ao-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {byProduct.map((p, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p._id}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.units}</td>
                  <td className="ao-amount">₹{p.revenue?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* UTM / Campaign attribution */}
      <div className="analytics-card">
        <h3>Campaign Attribution (UTM)</h3>
        <p className="analytics-sub">Orders that arrived via tracked links.</p>

        {/* ── URL Generator ── */}
        <div className="utm-generator">
          <p className="utm-generator-title">Generate a tracked link</p>
          <div className="utm-generator-grid">

            <div className="utm-gen-field">
              <label>Product</label>
              <select value={utmForm.product} onChange={e => { setUtmForm(p => ({ ...p, product: e.target.value })); setGeneratedUrl(''); }}>
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p._id} value={p.slug || p.name?.toLowerCase().replace(/\s+/g, '-')}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="utm-gen-field">
              <label>Source</label>
              <select value={utmForm.source} onChange={e => { setUtmForm(p => ({ ...p, source: e.target.value })); setGeneratedUrl(''); }}>
                <option value="">Select source</option>
                {UTM_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="utm-gen-field">
              <label>Medium</label>
              <select value={utmForm.medium} onChange={e => { setUtmForm(p => ({ ...p, medium: e.target.value })); setGeneratedUrl(''); }}>
                <option value="">Select medium</option>
                {UTM_MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="utm-gen-field">
              <label>Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. summer-2024"
                value={utmForm.campaign}
                onChange={e => { setUtmForm(p => ({ ...p, campaign: e.target.value })); setGeneratedUrl(''); }}
              />
            </div>

          </div>

          <button
            className="utm-gen-btn"
            onClick={handleGenerateUrl}
            disabled={!utmForm.product || !utmForm.source || !utmForm.medium || !utmForm.campaign.trim()}
          >
            Generate Link
          </button>

          {generatedUrl && (
            <div className="utm-result">
              <code className="utm-result-url">{generatedUrl}</code>
              <button className="utm-copy-btn" onClick={handleCopy}>
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        <div className="utm-divider" />

        {/* ── Attribution table ── */}
        {byUTM.length === 0 ? (
          <div className="utm-empty">
            <p>No UTM-tracked orders in this period.</p>
          </div>
        ) : (
          <table className="ao-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Medium</th>
                <th>Campaign</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {byUTM.map((u, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u._id.source || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u._id.medium || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u._id.campaign || '—'}</td>
                  <td>{u.orders}</td>
                  <td className="ao-amount">₹{u.revenue?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRevenueAnalytics;