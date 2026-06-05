// File: ./frontend/src/components/cart/CartSummary.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import './CartSummary.css';

const CartSummary = ({ onClose }) => {
  const { cart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const total = getCartTotal();
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (onClose) onClose();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-summary">
      <div className="cart-summary-row">
        <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        <span>₹{total.toLocaleString('en-IN')}</span>
      </div>
      <div className="cart-summary-row">
        <span>Shipping</span>
        <span className="free-tag">FREE</span>
      </div>
      <div className="cart-summary-divider" />
      <div className="cart-summary-row cart-summary-total">
        <span>Total</span>
        <span>₹{total.toLocaleString('en-IN')}</span>
      </div>
      <button
        className="checkout-btn"
        onClick={handleCheckout}
        disabled={cart.length === 0}
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
      </button>
      {!isAuthenticated && (
        <p className="guest-note">Sign in to save your cart and track orders</p>
      )}
    </div>
  );
};

export default CartSummary;