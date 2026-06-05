// File: ./frontend/src/pages/ProductDetailPage.jsx  (MODIFIED)
// Changes from original:
//   1. Removed handleOrderClick (no longer navigates to /order/:id)
//   2. ProductDetails component now receives onSizeChartClick prop
//      (Add to Cart / Buy Now are handled internally inside ProductDetails)
//   3. All original image gallery, breadcrumb, dropdown sections, layout UNCHANGED
//   4. SizeChart modal wiring is unchanged

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/productService';
import ProductDetails from '../components/products/ProductDetails';
import SizeChart from '../components/products/SizeChart';
import Loader from '../components/common/Loader';
import { formatPrice, scrollToTop } from '../utils/helpers';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Testimonials from '../components/home/Testimonials';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productSlug } = useParams();
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

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">

        {/* Breadcrumb — unchanged */}
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

        {/* Product Details layout — unchanged */}
        <div className="product-detail-container">

          {/* Left Side - Image Gallery (Sticky) — unchanged */}
          <div className="product-gallery">
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

          {/* Right Side - Product Info
              CHANGED: replaced inline JSX with ProductDetails component.
              Size selection, Add to Cart, Buy Now are all inside ProductDetails now. */}
          <div className="product-info">
            <ProductDetails
              product={product}
              onSizeChartClick={() => setShowSizeChart(true)}
            />

            {/* Dropdown Sections — unchanged */}
            <div className="dropdown-sections">

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
                    <p>{product.description}</p>
                    {product.fabric && (
                      <p><strong>Fabric:</strong> {product.fabric}</p>
                    )}
                  </div>
                )}
              </div>

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
                    <p>Since every piece is made to order, we don't accept returns or cancellations. But if you receive a wrong or a damaged piece, we'll make it right with an exchange (just keep an unboxing video handy 🪄).</p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Size Chart Modal — unchanged */}
      <SizeChart isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />

      <FeaturedProducts />
      <Testimonials />
    </div>
  );
};

export default ProductDetailPage;