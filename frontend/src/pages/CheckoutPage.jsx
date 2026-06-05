import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import addressService from '../services/addressService';
import './CheckoutPage.css';
import api from '../services/api';

const STEPS = ['Address', 'Review'];

// Load Razorpay checkout script once
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) {
      resolve(!!window.Razorpay);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Redirect away if cart is empty (and no order placed yet)
  useEffect(() => {
    if (cart.length === 0 && !placedOrder) navigate('/cart', { replace: true });
  }, [cart, placedOrder, navigate]);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressService.getAll();
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault);
        if (def) setSelectedAddressId(def._id);
        else if (res.data.length > 0) setSelectedAddressId(res.data[0]._id);
      } catch {
        setError('Failed to load addresses. Please add one in your account.');
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Pre-load Razorpay SDK
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
  const total = getCartTotal();
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  // ─────────────────────────────────────────────────────────────────────────────
  // handlePlaceOrder
  // ─────────────────────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ── 1. Ensure SDK is ready ──────────────────────────────────────────────
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady || !window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your connection and try again.');
      }

      const shippingAddress = {
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country || 'India',
      };

      // ── 2. Create Razorpay order on backend ────────────────────────────────
      const orderData = await api.post('/payments/create-order', { shippingAddress, notes });

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order.');
      }

      const { orderId, amount, currency } = orderData;

      // ── 3. Open Razorpay modal ──────────────────────────────────────────────
      await new Promise((resolve, reject) => {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount,                      // already in paise from backend
          currency,
          name: 'Your Store Name',     // ← replace with your brand name
          description: 'Order Payment',
          order_id: orderId,

          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },

          theme: { color: '#000000' }, // ← change to your brand colour

          // ── Payment success ────────────────────────────────────────────────
          handler: async (response) => {
            try {
              const verifyData = await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress,
                notes,
              });

              if (!verifyData.success) {
                throw new Error(verifyData.message || 'Payment verification failed.');
              }

              await clearCart();
              setPlacedOrder(verifyData.data);
              setStep(2);
              resolve();
            } catch (verifyErr) {
              setError(
                verifyErr.response?.data?.message ||
                verifyErr.message ||
                'Payment verification failed. Contact support.'
              );
              setLoading(false);
              reject(verifyErr);
            }
          },

          // ── Modal closed without payment ──────────────────────────────────
          modal: {
            ondismiss: () => {
              setError('Payment cancelled. You can try again.');
              setLoading(false);
              resolve(); // resolve so the outer promise doesn't hang
            },
          },
        };

        const rzp = new window.Razorpay(options);

        // ── Payment failed event ───────────────────────────────────────────
        rzp.on('payment.failed', (response) => {
          setError(
            response.error?.description ||
            response.error?.reason ||
            'Payment failed. Please try again.'
          );
          setLoading(false);
          resolve();
        });

        rzp.open();
      });
    } catch (err) {
      console.error('handlePlaceOrder error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to initiate payment.'
      );
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Success screen
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 2 && placedOrder) {
    return (
      <div className="checkout-page">
        <div className="checkout-page-hero">
          <div className="container">
            <h1 className="checkout-title">Order Confirmed</h1>
          </div>
        </div>
        <div className="container">
          <div className="checkout-success">
            <div className="success-icon-wrap">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>Order Placed</h2>
            <p>Thank you, {user?.name}. Your order has been received and is being processed.</p>
            <div className="success-order-number">#{placedOrder.orderNumber}</div>
            <p className="success-email-note">
              Confirmation sent to <strong>{user?.email}</strong>
            </p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/account')}>
                Track Orders
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/collections')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main checkout render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="checkout-page page-with-bg-logo">
      <div className="checkout-page-hero">
        <div className="container">
          <h1 className="checkout-title">Checkout</h1>
        </div>
      </div>

      <div className="container">
        <div className="checkout-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={[
                'stepper-step',
                step === i ? 'stepper-step--active' : '',
                step > i  ? 'stepper-step--done'   : '',
              ].join(' ').trim()}>
                <span className="stepper-num">{step > i ? '✓' : i + 1}</span>
                <span className="stepper-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`stepper-line ${step > i ? 'stepper-line--done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && <div className="checkout-error">{error}</div>}

        <div className="checkout-layout">
          <div className="checkout-main">

            {/* ── Step 0: Address ── */}
            {step === 0 && (
              <div className="checkout-section">
                <h3>Delivery Address</h3>
                {addressLoading ? (
                  <div className="checkout-loading"><span className="co-spinner" /></div>
                ) : addresses.length === 0 ? (
                  <div className="checkout-no-address">
                    <p>No saved addresses found.</p>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/account')}>
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="address-select-list">
                    {addresses.map((addr) => (
                      <label key={addr._id}
                        className={`address-select-card ${selectedAddressId === addr._id ? 'address-select-card--selected' : ''}`}>
                        <input
                          type="radio"
                          name="address"
                          value={addr._id}
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                        />
                        <div className="asc-content">
                          <div className="asc-top">
                            <span className="asc-label">{addr.label}</span>
                            {addr.isDefault && <span className="asc-default">Default</span>}
                          </div>
                          <p className="asc-name">{addr.recipientName}</p>
                          <p className="asc-address">
                            {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="asc-phone">📞 {addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <div className="checkout-section-footer">
                  <div className="notes-field">
                    <label>Order Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for your order…"
                      rows={3}
                    />
                  </div>
                  <button
                    className="checkout-next-btn"
                    onClick={() => { setError(''); setStep(1); }}
                    disabled={!selectedAddressId || addressLoading}
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 1: Review & Pay ── */}
            {step === 1 && (
              <div className="checkout-section">
                <h3>Review Your Order</h3>
                <div className="review-items">
                  {cart.map((item) => (
                    <div key={item._cartItemId || item._id} className="review-item">
                      {(item.images?.[0] || item.productImage) && (
                        <img
                          src={item.images?.[0] || item.productImage}
                          alt={item.name}
                          className="review-item-img"
                        />
                      )}
                      <div className="review-item-info">
                        <span className="review-item-name">{item.name || item.productName}</span>
                        <span className="review-item-meta">
                          Qty {item.quantity} ·{' '}
                          {item.sizeType === 'standard'
                            ? `Size ${item.standardSize}`
                            : `Custom (B:${item.customMeasurements?.bust}" W:${item.customMeasurements?.waist}")`}
                        </span>
                      </div>
                      <span className="review-item-price">
                        ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedAddress && (
                  <div className="review-address-box">
                    <h5>Delivering to</h5>
                    <p>{selectedAddress.recipientName} · {selectedAddress.phone}</p>
                    <p>{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}</p>
                  </div>
                )}

                <div className="review-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                  <button className="checkout-next-btn" onClick={handlePlaceOrder} disabled={loading}>
                    {loading
                      ? <><span className="co-spinner co-spinner--sm" /> Processing…</>
                      : 'Make Payment'}
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="checkout-sidebar">
            <div className="checkout-summary-box">
              <h4>Order Summary</h4>
              <div className="cs-row">
                <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="cs-row">
                <span>Shipping</span>
                <span className="cs-free">FREE</span>
              </div>
              <div className="cs-divider" />
              <div className="cs-row cs-row--total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;