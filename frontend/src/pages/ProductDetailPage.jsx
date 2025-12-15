// File: ./frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../services/productService';
import SizeChart from '../components/products/SizeChart';
import Loader from '../components/common/Loader';
import { formatPrice, scrollToTop } from '../utils/helpers';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

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
          {/* Left Side - Image Gallery (Sticky) */}
          <div className="product-gallery">
            {/* Thumbnail Images */}
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

            {/* Main Image */}
            <div className="main-image">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="product-main-img"
              />
              {!product.inStock && (
                <div className="stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Product Info (Scrollable) */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>

            {/* Price */}
            <div className="product-price-section">
              <span className="current-price">{formatPrice(displayPrice)}</span>
            </div>

            {/* Available Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="available-sizes">
                <span className="size-label">Available Sizes:</span>
                <span className="size-value">{product.sizes.join(', ')}</span>
              </div>
            )}

            {/* Order Button */}
            <button
              className="btn btn-primary btn-lg order-btn"
              onClick={handleOrderClick}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Buy now' : 'Out of Stock'}
            </button>

            {/* Size Chart Button */}
            <button
              className="btn btn-secondary size-chart-btn"
              onClick={() => setShowSizeChart(true)}
            >
              Size chart
            </button>

            {/* Features - Single Full Width Image */}
            {/* <div className="product-features">
              <img src="https://i.postimg.cc/NFDQFFsh/icon1.png" alt="Feature Icon 1" className="feature-iconn" />
              <img src="https://i.postimg.cc/mkjTkkLf/icon2.png" alt="Feature Icon 2" className="feature-iconn" />
              <img src="https://i.postimg.cc/KjfmjjGh/icon3.png" alt="Feature Icon 3" className="feature-iconn" />
            </div> */}
            {/* Features - Single Full Width Image */}
<div className="product-features">
  <div className="feature-item">
    <img src="https://i.ibb.co/sdhtTzbH/breathable.png" alt="Feature Icon 1" className="feature-iconn" />
    <span className="feature-text">Breathable</span>
  </div>
  <div className="feature-item">
    <img src="https://i.ibb.co/mCCfZWCM/women-owned.png" alt="Feature Icon 3" className="feature-iconn" />
    <span className="feature-text">Women - Owned</span>
  </div>
  <div className="feature-item">
    <img src="https://i.ibb.co/VW1c2RzT/custom-sizing.png" alt="Feature Icon 2" className="feature-iconn" />
    <span className="feature-text">Custom Sizing</span>
  </div>
</div>

            {/* Dropdown Sections */}
            <div className="dropdown-sections">
              {/* Description */}
              <div className="dropdown-section">
                <button
                  className={`dropdown-header ${openDropdown === 'description' ? 'open' : ''}`}
                  onClick={() => toggleDropdown('description')}
                >
                  <h3>Description</h3>
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {openDropdown === 'description' && (
                  <div className="dropdown-content">
                    {/* <h4 className="description-main-heading">Upgrade your style with our Pehnawa!</h4> */}
                    <p>{product.description}</p>
                    {product.fabric && (
                      <p><strong>Fabric:</strong> {product.fabric}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Wash Care */}
              <div className="dropdown-section">
                <button
                  className={`dropdown-header ${openDropdown === 'care' ? 'open' : ''}`}
                  onClick={() => toggleDropdown('care')}
                >
                  <h3>Wash Care</h3>
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {openDropdown === 'care' && (
                  <div className="dropdown-content">
                    <p>{product.care || "Since it's crafted with natural colors and hand-printed, please hand wash with mild detergent to ensure longer-lasting beauty."}</p>
                  </div>
                )}
              </div>

              {/* Returns/Exchanges */}
              <div className="dropdown-section">
                <button
                  className={`dropdown-header ${openDropdown === 'returns' ? 'open' : ''}`}
                  onClick={() => toggleDropdown('returns')}
                >
                  <h3>Returns / Exchanges</h3>
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {openDropdown === 'returns' && (
                  <div className="dropdown-content">
                    <p>Since every piece is made to order, we don't accept returns or cancellations. But if you receive a wrong or a damaged piece, we'll make it right with an exchange (just keep an unboxing video handy 🪄)</p>
                  </div>
                )}
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