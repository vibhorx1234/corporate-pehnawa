// File: ./frontend/src/pages/OrderPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import OrderForm from '../components/orders/OrderForm';
import Loader from '../components/common/Loader';
import { formatPrice, scrollToTop } from '../utils/helpers';
import './OrderPage.css';

const OrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/collections')} className="btn btn-primary">
          Back to Collections
        </button>
      </div>
    );
  }
  if (!product) return <div className="error-message">Product not found</div>;

  const displayPrice = product.discountedPrice || product.price;

  return (
    <div className="order-page">
      <div className="container">
        <div className="order-container">
          {/* Product Summary */}
          <div className="product-summary">
            <h2 className="section-heading">Order Summary</h2>
            <div className="summary-card">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="summary-image"
              />
              <div className="summary-details">
                <h3 className="summary-product-name">{product.name}</h3>
                {product.collection && (
                  <p className="summary-collection">{product.collection.name}</p>
                )}
                <p className="summary-price">{formatPrice(displayPrice)}</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="order-notes">
              <h3>Important information</h3>
              <ul>
                <li>Please ensure all details are correct before submitting</li>
                <li>Upload payment screenshot after making UPI payment</li>
                <li>You will receive order confirmation via email</li>
                <li>Custom measurements take 7-10 business days</li>
                <li>Standard sizes are shipped within 3-5 business days</li>
              </ul>
            </div>
          </div>

          {/* Order Form */}
          <div className="order-form-section">
            <h2 className="section-heading">Order details</h2>
            <OrderForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;