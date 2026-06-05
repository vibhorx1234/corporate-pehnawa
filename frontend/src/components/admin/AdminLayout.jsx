// File: ./frontend/src/components/admin/AdminLayout.jsx  (NEW)

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './AdminLayout.css';

const NAV_ITEMS = [
  { path: '/admin',                     label: 'Dashboard',          icon: '🏠', exact: true },
  { path: '/admin/orders',              label: 'Orders',             icon: '📦' },
  { path: '/admin/customers',           label: 'Customers',          icon: '👥' },
  { path: '/admin/abandoned-carts',     label: 'Abandoned Carts',    icon: '🛒' },
  { path: '/admin/analytics/revenue',   label: 'Revenue Analytics',  icon: '📊' },
  { path: '/admin/analytics/customers', label: 'Customer Analytics', icon: '📈' },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'admin-layout--collapsed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo">⚙️ Admin</span>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
              }
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          {sidebarOpen && (
            <p className="admin-user-name">{user?.name}</p>
          )}
          <button className="admin-logout-btn" onClick={handleLogout} title="Sign out">
            <span>🚪</span>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;