// File: ./frontend/src/pages/CollectionSubcategoryProducts.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsBySubcategory } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { scrollToTop } from '../utils/helpers';
import './CollectionProducts.css';

const CollectionSubcategoryProducts = () => {
  const { collectionSlug, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchProducts();
  }, [collectionSlug, subcategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductsBySubcategory(collectionSlug, subcategory);
      setProducts(response.data);
      setCollection(response.collection);
      setSubcategoryData(response.subcategory);
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
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/collections" className="breadcrumb-link">Collections</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/collections/${collectionSlug}/subcategories`} className="breadcrumb-link">
            {collection?.name}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{subcategoryData?.name}</span>
        </nav>

        <div className="collection-header">
          <h1 className="collection-title">{subcategoryData?.name}</h1>
          {subcategoryData?.description && (
            <p className="collection-description">{subcategoryData.description}</p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products available in this subcategory yet.</p>
            <Link to={`/collections/${collectionSlug}/subcategories`} className="btn btn-primary">
              Back to {collection?.name || 'Collection'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSubcategoryProducts;