// File: ./frontend/src/pages/AccountPage.jsx

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import OrderHistory from '../components/account/OrderHistory';
import AddressBook from '../components/account/AddressBook';
import ProfileForm from '../components/account/ProfileForm';
import './AccountPage.css';

const TABS = [
  {
    id: 'orders', label: 'Orders',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    )
  },
  {
    id: 'addresses', label: 'Addresses',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    )
  },
  {
    id: 'profile', label: 'Profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    )
  },
];

const AccountPage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const navigate = useNavigate();

    return (
        <div className="account-page page-with-bg-logo">
            <div className="container">
                <div className="account-layout">

                    {/* Sidebar */}
                    <aside className="account-sidebar">
                        <div className="account-user-info">
                            <div className="account-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="account-user-name">{user?.name}</p>
                                <p className="account-user-email">{user?.email}</p>
                            </div>
                        </div>

                        <nav className="account-nav">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`account-nav-btn ${activeTab === tab.id ? 'account-nav-btn--active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                            {user?.role === "admin" && (
                                <button
                                    className="account-nav-btn account-nav-btn--admin"
                                    onClick={() => navigate("/admin")}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        {/* Shield/Admin Icon */}
                                        <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    Admin Panel
                                </button>
                            )}
                            <button className="account-nav-btn account-nav-btn--logout" onClick={logout}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="account-main">
                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'addresses' && <AddressBook />}
                        {activeTab === 'profile' && <ProfileForm />}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default AccountPage;