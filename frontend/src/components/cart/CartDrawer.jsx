// File: ./frontend/src/components/cart/CartDrawer.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, clearCart, cartLoading } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? 'cart-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} role="dialog" aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h3>Your Cart {cart.length > 0 && <span className="cart-count-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}</h3>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartLoading ? (
            <div className="cart-empty-state">
              <span className="cart-spinner" />
              <p>Loading your cart…</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty-state">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p>Your cart is empty</p>
              <Link to="/collections" className="btn btn-primary btn-sm" onClick={onClose}>
                Browse Collections
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map(item => (
                  <CartItem key={item._cartItemId || item._id} item={item} />
                ))}
              </div>
              {cart.length > 0 && (
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear all
                </button>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && !cartLoading && (
          <div className="cart-drawer-footer">
            <CartSummary onClose={onClose} />
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;