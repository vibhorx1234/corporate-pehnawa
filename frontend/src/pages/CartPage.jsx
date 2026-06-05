// File: ./frontend/src/pages/CartPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import './CartPage.css';

const CartPage = () => {
  const { cart, cartLoading } = useCart();
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="cart-page page-with-bg-logo">
      <div className="cart-page-hero">
        <div className="container">
          <div className="cart-page-hero-inner">
            <h1>Shopping Cart</h1>
            {cart.length > 0 && (
              <span className="cart-page-count">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Loading */}
        {cartLoading ? (
          <div className="cart-page-loading">
            <span className="cp-spinner" />
            <p>Loading your cart…</p>
          </div>

        /* Empty */
        ) : cart.length === 0 ? (
          <div className="cart-page-empty">
            <div className="cart-empty-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.25"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Explore our collections and find something you love.</p>
            <Link to="/collections" className="btn btn-primary">Browse Collections</Link>
          </div>

        /* Cart */
        ) : (
          <div className="cart-page-layout">
            <div className="cart-page-items">
              {cart.map(item => (
                <CartItem
                  key={item._cartItemId || item._id + (item.standardSize || '')}
                  item={item}
                />
              ))}
            </div>

            <div className="cart-page-sidebar">
              <CartSummary />
              <Link to="/collections" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;