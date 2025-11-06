import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedCollections } from '../../services/collectionService';
import Loader from '../common/Loader';
import './CollectionThumbnails.css';

const CollectionThumbnails = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await getFeaturedCollections();
      setCollections(response.data);
    } catch (err) {
      setError('Failed to load collections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (collections.length === 0) return null;

  return (
    <section className="collection-thumbnails">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-titlee">Our Collections</h2>
          <p className="section-subtitle">
            For people who believe workwear can be stylish, comfortable, & rooted in culture
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
                    <h3 className="collection-name">{collection.name}</h3>
                    <p className="collection-descriptionn">{collection.description}</p>
                    <span className="collection-link">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="section-footer">
          <Link to="/collections" className="btn btn-secondary btn-lg">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionThumbnails;