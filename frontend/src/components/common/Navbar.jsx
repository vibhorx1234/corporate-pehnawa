// File: ./frontend/src/components/common/Navbar.jsx

import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from '../../utils/constants';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Corporate Pahanava Logo" className="logo-image" />
          <div className="logo-text-container">
            <span className="logo-text">Corporate</span>
            <span className="logo-hindi">पहनावा</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.path} className="navbar-item">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? 'navbar-link active' : 'navbar-link'
                }
                onClick={closeMenu}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <ThemeToggle />
          
          {/* Mobile Menu Toggle */}
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
  );
};

export default Navbar;