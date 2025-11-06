// File: ./frontend/src/components/products/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const discount = calculateDiscount(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-image-container">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-badges">
          {discount > 0 && (
            <span className="product-badge discount-badge">-{discount}%</span>
          )}
        </div>
        {!product.inStock && (
          <div className="product-overlay">
            <span className="out-of-stock">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="product-info">
        {product.collection && (
          <p className="product-collection">{product.collection.name}</p>
        )}
        <h3 className="product-namee">{product.name}</h3>
        
        <div className="product-pricing">
          <span className="product-price">{formatPrice(displayPrice)}</span>
          {/* {product.discountedPrice && (
            <span className="product-original-price">
              {formatPrice(product.price)}
            </span>
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;