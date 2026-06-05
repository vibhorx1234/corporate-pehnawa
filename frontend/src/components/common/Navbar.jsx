// File: ./frontend/src/components/common/Navbar.jsx  (MODIFIED)
// Changes from original:
//   1. Added cart icon button with item count badge
//   2. Added account/login link that changes based on auth state
//   3. Imported useCart and useAuth hooks
//   4. CartDrawer imported and wired to cart icon toggle
//   5. All original banner, logo, nav links, social links code is UNCHANGED

import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { NAV_LINKS, SOCIAL_LINKS } from '../../utils/constants';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import CartDrawer from '../cart/CartDrawer';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { setTheme } = useContext(ThemeContext);
  const { getCartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = getCartCount();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    const handleThemeChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [setTheme]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/');
  };

  const socialIcons = {
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    youtube: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    ),
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  };

  return (
    <>
      {/* Moving Text Banner — unchanged */}
      <div className="moving-banner">
        <div className="banner-content">
          <div className="banner-track">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="banner-text">
                Free Shipping &emsp;&emsp;&emsp;•&emsp;&emsp;&emsp; Size Inclusive &emsp;&emsp;&emsp;•&emsp;&emsp;&emsp; Women - Owned &emsp;&emsp;&emsp;•&emsp;&emsp;&emsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src={logo} alt="Corporate Pahanava Logo" className="logo-image" />
            <div className="logo-text-container">
              <span className="logo-text">Corporate</span>
              <span className="logo-hindi">पहनावा</span>
            </div>
          </Link>

          <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.path} className="navbar-item">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                  onClick={closeMenu}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {/* Mobile: account link inside menu */}
            <li className="navbar-item mobile-account-link">
              {isAuthenticated ? (
                <>
                  <NavLink to="/account" className="navbar-link" onClick={closeMenu}>
                    My Account
                  </NavLink>
                  <button className="navbar-link navbar-logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="navbar-link" onClick={closeMenu}>
                  Sign In
                </NavLink>
              )}
            </li>

            <li className="navbar-item mobile-social">
              <div className="social-links">
                {SOCIAL_LINKS.facebook && (
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                    {socialIcons.facebook}
                  </a>
                )}
                {SOCIAL_LINKS.instagram && (
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                    {socialIcons.instagram}
                  </a>
                )}
                {SOCIAL_LINKS.youtube && (
                  <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                    {socialIcons.youtube}
                  </a>
                )}
              </div>
            </li>
          </ul>

          <div className="navbar-actions">
            {/* Desktop: social icons — unchanged */}
            <div className="social-links desktop-social">
              {SOCIAL_LINKS.facebook && (
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  {socialIcons.facebook}
                </a>
              )}
              {SOCIAL_LINKS.instagram && (
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  {socialIcons.instagram}
                </a>
              )}
              {SOCIAL_LINKS.youtube && (
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                  {socialIcons.youtube}
                </a>
              )}
            </div>

            {/* NEW: Desktop account link */}
            <div className="navbar-auth desktop-auth">
              {isAuthenticated ? (
                <Link to="/account" className="navbar-avatar-btn" title={user?.name}>
                  Hello, {user?.name?.split(' ')[0]}
                </Link>
              ) : (
                <Link to="/login" className="navbar-account-btn" title="Sign In">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
              )}
            </div>

            {/* NEW: Cart icon with badge */}
            <button
              className="navbar-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Cart (${cartCount} items)`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>

            <button
              className={`navbar-toggle ${isOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;