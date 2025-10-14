// File: ./frontend/src/pages/Collections.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCollections } from '../services/collectionService';
import Loader from '../components/common/Loader';
import { scrollToTop } from '../utils/helpers';
import './Collections.css';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await getAllCollections({ active: true });
      setCollections(response.data);
    } catch (err) {
      setError('Failed to load collections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="collections-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Our Collections</h1>
          <p className="page-subtitle">
            Explore our curated collections of premium fashion designed for every professional
          </p>
        </div>

        {/* Collections Grid */}
        <div className="collections-grid">
          {collections.map((collection) => (
            <Link
              key={collection._id}
              to={`/collections/${collection.slug}`}
              className="collection-item"
            >
              <div className="collection-image-wrapper">
                <img
                  src={collection.thumbnail}
                  alt={collection.name}
                  className="collection-image"
                  loading="lazy"
                />
                <div className="collection-overlay">
                  <div className="collection-content">
                    <h2 className="collection-titlee">{collection.name}</h2>
                    <p className="collection-desc">{collection.description}</p>
                    <span className="collection-link">
                      View Collection →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {collections.length === 0 && !loading && (
          <div className="no-collections">
            <p>No collections available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;