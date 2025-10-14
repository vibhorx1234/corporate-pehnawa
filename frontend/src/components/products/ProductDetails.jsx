// File: ./frontend/src/components/products/ProductDetails.jsx

import React from 'react';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import './ProductDetails.css';

const ProductDetails = ({ product, onOrderClick, onSizeChartClick }) => {
  const discount = calculateDiscount(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;

  return (
    <div className="product-details-component">
      {product.collection && (
        <p className="product-collection-label">{product.collection.name}</p>
      )}
      
      <h1 className="product-name-heading">{product.name}</h1>

      {/* Price Section */}
      <div className="price-section">
        <span className="price-current">{formatPrice(displayPrice)}</span>
        {product.discountedPrice && (
          <>
            <span className="price-original">{formatPrice(product.price)}</span>
            <span className="price-save">Save {formatPrice(product.price - product.discountedPrice)}</span>
          </>
        )}
      </div>

      {/* Description */}
      <div className="description-section">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>

      {/* Product Details */}
      <div className="details-section">
        {product.fabric && (
          <div className="detail-row">
            <span className="detail-label">Fabric:</span>
            <span className="detail-value">{product.fabric}</span>
          </div>
        )}
        {product.care && (
          <div className="detail-row">
            <span className="detail-label">Care Instructions:</span>
            <span className="detail-value">{product.care}</span>
          </div>
        )}
        {product.sizes && product.sizes.length > 0 && (
          <div className="detail-row">
            <span className="detail-label">Available Sizes:</span>
            <span className="detail-value">{product.sizes.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Size Chart Button */}
      <button 
        className="btn btn-secondary size-chart-button"
        onClick={onSizeChartClick}
      >
        View Size Chart
      </button>

      {/* Order Button */}
      <button
        className="btn btn-primary btn-lg order-button"
        onClick={onOrderClick}
        disabled={!product.inStock}
      >
        {product.inStock ? 'Place Order' : 'Out of Stock'}
      </button>

      {/* Additional Features */}
      <div className="features-section">
        <div className="feature-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Premium Quality Fabric</span>
        </div>
        <div className="feature-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Fast Delivery</span>
        </div>
        <div className="feature-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span>Custom Tailoring Available</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;