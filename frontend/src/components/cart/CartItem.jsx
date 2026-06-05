// File: ./frontend/src/components/cart/CartItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const price = item.discountedPrice || item.price;
  const imageUrl = item.images?.[0] || item.productImage || '/placeholder.png';
  const sizeLabel = item.sizeType === 'standard'
    ? item.standardSize
    : `Custom (B:${item.customMeasurements?.bust}" W:${item.customMeasurements?.waist}")`;

  return (
    <div className="cart-item">
      <Link to={`/product/${item.slug || ''}`} className="cart-item-image-wrap">
        <img src={imageUrl} alt={item.name || item.productName} className="cart-item-image" />
      </Link>

      <div className="cart-item-details">
        <div className="cart-item-top">
          <div>
            <h4 className="cart-item-name">{item.name || item.productName}</h4>
            <span className="cart-item-size">Size: {sizeLabel}</span>
          </div>
          <button
            className="cart-item-remove"
            onClick={() => removeFromCart(item._id, item._cartItemId)}
            aria-label="Remove item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="cart-item-bottom">
          <div className="cart-item-qty">
            <button
              className="qty-btn"
              onClick={() => updateQuantity(item._id, item.quantity - 1, item._cartItemId)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >−</button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => updateQuantity(item._id, item.quantity + 1, item._cartItemId)}
              aria-label="Increase quantity"
            >+</button>
          </div>
          <span className="cart-item-price">₹{(price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;