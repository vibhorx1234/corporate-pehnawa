// File: ./frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../services/productService';
import SizeChart from '../components/products/SizeChart';
import Loader from '../components/common/Loader';
import { formatPrice, calculateDiscount, scrollToTop } from '../utils/helpers';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    scrollToTop();
    fetchProduct();
  }, [productSlug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductBySlug(productSlug);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = () => {
    if (product) {
      navigate(`/order/${product._id}`);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  const discount = calculateDiscount(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/collections" className="breadcrumb-link">Collections</Link>
          {product.collection && (
            <>
              <span className="breadcrumb-separator">/</span>
              <Link 
                to={`/collections/${product.collection.slug}`} 
                className="breadcrumb-link"
              >
                {product.collection.name}
              </Link>
            </>
          )}
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="product-detail-container">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="product-main-img"
              />
              {discount > 0 && (
                <span className="discount-badge">{discount}% OFF</span>
              )}
              {!product.inStock && (
                <div className="stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            {product.collection && (
              <p className="product-collection-name">{product.collection.name}</p>
            )}
            <h1 className="product-name">{product.name}</h1>

            {/* Price */}
            <div className="product-price-section">
              <span className="current-price">{formatPrice(displayPrice)}</span>
              {/* {product.discountedPrice && (
                <>
                  <span className="original-price">{formatPrice(product.price)}</span>
                  <span className="save-amount">Save {formatPrice(product.price - product.discountedPrice)}</span>
                </>
              )} */}
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="product-details">
              {product.fabric && (
                <div className="detail-item">
                  <span className="detail-label">Fabric:</span>
                  <span className="detail-value">{product.fabric}</span>
                </div>
              )}
              {product.care && (
                <div className="detail-item">
                  <span className="detail-label">Care:</span>
                  <span className="detail-value">{product.care}</span>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Available Sizes:</span>
                  <span className="detail-value">{product.sizes.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Size Chart Button */}
            <button 
              className="btn btn-secondary size-chart-btn"
              onClick={() => setShowSizeChart(true)}
            >
              View Size Chart
            </button>

            {/* Order Button */}
            <button
              className="btn btn-primary btn-lg order-btn"
              onClick={handleOrderClick}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Place Order' : 'Out of Stock'}
            </button>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium Quality Fabric</span>
              </div>
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span>Custom Tailoring Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChart isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />
    </div>
  );
};

export default ProductDetailPage;