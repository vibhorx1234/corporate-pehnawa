// File: ./frontend/src/pages/CategoriesPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubcategoriesByCollection } from '../services/subcategoryService';
import Loader from '../components/common/Loader';
import { scrollToTop } from '../utils/helpers';
import './CollectionProducts.css';

const CategoriesPage = () => {
  const { collectionSlug } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchSubcategories();
  }, [collectionSlug]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await getSubcategoriesByCollection(collectionSlug);
      setSubcategories(response.data);
      setCollection(response.collection);
    } catch (err) {
      setError('Failed to load categories');
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
          <span className="breadcrumb-current">{collection?.name}</span>
        </nav>

        {collection && (
          <div className="collection-header">
            <h1 className="collection-title">{collection.name}</h1>
            <p className="collection-description">{collection.description}</p>
          </div>
        )}

        <div className="subcategories-grid">
          {subcategories.map((sub) => (
            <Link
              key={sub._id}
              to={`/collections/${collectionSlug}/${sub.slug}`}
              className="subcategory-tile"
            >
              <div className="subcategory-image-wrapper">
                <img
                  src={sub.thumbnail}
                  alt={sub.name}
                  className="subcategory-image"
                  loading="lazy"
                />
                <div className="subcategory-overlay">
                  <div className="subcategory-content">
                    <h2 className="subcategory-titlee">{sub.name}</h2>
                    {/* {sub.description && (
                      <p className="subcategory-desc">{sub.description}</p>
                    )} */}
                    <span className="subcategory-link">View →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {subcategories.length === 0 && (
          <div className="no-products">
            <p>No categories available yet.</p>
            <Link to="/collections" className="btn btn-primary">
              Browse Other Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;