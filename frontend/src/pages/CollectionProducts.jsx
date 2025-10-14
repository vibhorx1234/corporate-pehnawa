// File: ./frontend/src/pages/CollectionProducts.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCollection } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { scrollToTop } from '../utils/helpers';
import './CollectionProducts.css';

const CollectionProducts = () => {
  const { collectionSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchProducts();
  }, [collectionSlug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductsByCollection(collectionSlug);
      setProducts(response.data);
      setCollection(response.collection);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="collection-products-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/collections" className="breadcrumb-link">Collections</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{collection?.name}</span>
        </nav>

        {/* Collection Header */}
        {collection && (
          <div className="collection-header">
            <h1 className="collection-title">{collection.name}</h1>
            <p className="collection-description">{collection.description}</p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products available in this collection yet.</p>
            <Link to="/collections" className="btn btn-primary">
              Browse Other Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionProducts;