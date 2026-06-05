//  ./frontend/src/components/products/ProductDetails.jsx  (MODIFIED)

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { SIZES, SIZE_TYPE, MAX_CART_QUANTITY } from '../../utils/constants';
import './ProductDetails.css';

const ProductDetails = ({ product, onOrderClick, onSizeChartClick }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const displayPrice = product.discountedPrice || product.price;

  // ── Size selection state ──────────────────────────────────────────────
  const [sizeTab, setSizeTab] = useState(SIZE_TYPE.STANDARD); // 'standard' | 'custom'
  const [selectedSize, setSelectedSize] = useState('');
  const [customMeasurements, setCustomMeasurements] = useState({ bust: '', waist: '' });
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState('');

  // ── Cart feedback state ───────────────────────────────────────────────
  const [cartStatus, setCartStatus] = useState('idle'); // 'idle' | 'adding' | 'added' | 'error'
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────
  const validateSize = useCallback(() => {
    if (sizeTab === SIZE_TYPE.STANDARD) {
      if (!selectedSize) {
        setSizeError('Please select a size to continue.');
        return false;
      }
    } else {
      const bust = parseFloat(customMeasurements.bust);
      const waist = parseFloat(customMeasurements.waist);
      if (!customMeasurements.bust || isNaN(bust) || bust < 20 || bust > 60) {
        setSizeError('Bust must be a number between 20 and 60 inches.');
        return false;
      }
      if (!customMeasurements.waist || isNaN(waist) || waist < 20 || waist > 50) {
        setSizeError('Waist must be a number between 20 and 50 inches.');
        return false;
      }
    }
    setSizeError('');
    return true;
  }, [sizeTab, selectedSize, customMeasurements]);

  // ── Build size options object ─────────────────────────────────────────
  const buildSizeOptions = useCallback(() => {
    if (sizeTab === SIZE_TYPE.STANDARD) {
      return { sizeType: SIZE_TYPE.STANDARD, standardSize: selectedSize };
    }
    return {
      sizeType: SIZE_TYPE.CUSTOM,
      customMeasurements: {
        bust: parseFloat(customMeasurements.bust),
        waist: parseFloat(customMeasurements.waist)
      }
    };
  }, [sizeTab, selectedSize, customMeasurements]);

  // ── Add to Cart ───────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!validateSize()) return;
    setCartStatus('adding');
    try {
      await addToCart(product, quantity, buildSizeOptions());
      setCartStatus('added');
      // Reset feedback after 2.5s
      setTimeout(() => setCartStatus('idle'), 2500);
    } catch (err) {
      setCartStatus('error');
      setTimeout(() => setCartStatus('idle'), 2500);
    }
  };

  // ── Buy Now ───────────────────────────────────────────────────────────
  const handleBuyNow = async () => {
    if (!validateSize()) return;
    setBuyNowLoading(true);
    try {
      await addToCart(product, quantity, buildSizeOptions());
      if (isAuthenticated) {
        navigate('/checkout');
      } else {
        navigate('/login', { state: { from: { pathname: '/checkout' } } });
      }
    } catch (err) {
      setSizeError('Could not add to cart. Please try again.');
    } finally {
      setBuyNowLoading(false);
    }
  };

  // ── Quantity helpers ──────────────────────────────────────────────────
  const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));
  const increaseQty = () => setQuantity(q => Math.min(MAX_CART_QUANTITY, q + 1));

  return (
    <div className="product-details-component">
      {product.collection && (
        <p className="product-collection-label">{product.collection.name}</p>
      )}

      <h1 className="product-name-heading">{product.name}</h1>

      {/* Price Section — unchanged */}
      <div className="price-section">
        <span className="price-current">{formatPrice(displayPrice)}</span>
        {/* {product.discountedPrice && (
          <>
            <span className="price-original">{formatPrice(product.price)}</span>
            <span className="price-save">
              Save {formatPrice(product.price - product.discountedPrice)}
            </span>
          </>
        )} */}
      </div>

      {/* ── NEW: Size Selector ─────────────────────────────────────────── */}
      <div className="size-selector-section">
        <div className="size-tabs">
          <button
            className={`size-tab ${sizeTab === SIZE_TYPE.STANDARD ? 'size-tab--active' : ''}`}
            onClick={() => { setSizeTab(SIZE_TYPE.STANDARD); setSizeError(''); }}
            type="button"
          >
            Standard Sizes
          </button>
          <button
            className={`size-tab ${sizeTab === SIZE_TYPE.CUSTOM ? 'size-tab--active' : ''}`}
            onClick={() => { setSizeTab(SIZE_TYPE.CUSTOM); setSizeError(''); }}
            type="button"
          >
            Custom Fit
          </button>
        </div>

        {sizeTab === SIZE_TYPE.STANDARD ? (
          <div className="standard-size-grid">
            {(product.sizes?.length > 0 ? product.sizes : SIZES).map(size => (
              <button
                key={size}
                type="button"
                className={`size-chip ${selectedSize === size ? 'size-chip--selected' : ''}`}
                onClick={() => { setSelectedSize(size); setSizeError(''); }}
              >
                {size}
              </button>
            ))}
          </div>
        ) : (
          <div className="custom-measurements">
            <p className="custom-note">
              We'll craft it perfectly for you!
            </p>
            <div className="measurement-row">
              <div className="measurement-field">
                <label>Bust (inches)</label>
                <input
                  type="number"
                  min="20"
                  max="60"
                  step="0.5"
                  placeholder="e.g. 36"
                  value={customMeasurements.bust}
                  onChange={e => {
                    setCustomMeasurements(p => ({ ...p, bust: e.target.value }));
                    setSizeError('');
                  }}
                />
              </div>
              <div className="measurement-field">
                <label>Waist (inches)</label>
                <input
                  type="number"
                  min="20"
                  max="50"
                  step="0.5"
                  placeholder="e.g. 28"
                  value={customMeasurements.waist}
                  onChange={e => {
                    setCustomMeasurements(p => ({ ...p, waist: e.target.value }));
                    setSizeError('');
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {sizeTab === SIZE_TYPE.STANDARD && (
          <p className="custom-fit-nudge">
            Didn't find your size? Don't worry babe, we'll craft it for you 🧵👸
          </p>
        )}

        {sizeError && <p className="size-error">{sizeError}</p>}

        {/* Size chart link */}
        <button className="size-chart-inline-btn" onClick={onSizeChartClick} type="button">
          View Size Chart
        </button>
      </div>

      {/* ── NEW: Quantity Selector ─────────────────────────────────────── */}
      <div className="quantity-selector">
        <span className="qty-label">Quantity</span>
        <div className="qty-control">
          <button type="button" className="qty-btn-ctrl" onClick={decreaseQty} disabled={quantity <= 1}>−</button>
          <span className="qty-display">{quantity}</span>
          <button type="button" className="qty-btn-ctrl" onClick={increaseQty} disabled={quantity >= MAX_CART_QUANTITY}>+</button>
        </div>
      </div>

      {/* ── NEW: Action Buttons ────────────────────────────────────────── */}
      <div className="product-action-btns">
        <button
          type="button"
          className={`btn-add-to-cart ${cartStatus === 'added' ? 'btn-add-to-cart--added' : ''} ${cartStatus === 'error' ? 'btn-add-to-cart--error' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock || cartStatus === 'adding'}
        >
          {cartStatus === 'adding' && <span className="pd-spinner" />}
          {cartStatus === 'added'  && <span className="pd-check">✓</span>}
          {cartStatus === 'error'  && '✕ Try Again'}
          {cartStatus === 'idle'   && (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </>
          )}
          {cartStatus === 'added' && ' Added!'}
        </button>

        <button
          type="button"
          className="btn-buy-now"
          onClick={handleBuyNow}
          disabled={!product.inStock || buyNowLoading}
        >
          {buyNowLoading
            ? <span className="pd-spinner pd-spinner--dark" />
            : product.inStock ? 'Buy Now' : 'Out of Stock'
          }
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;