// File: ./frontend/src/components/collections/CollectionCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './CollectionCard.css';

const CollectionCard = ({ collection }) => {
  return (
    <Link to={`/collections/${collection.slug}`} className="collection-card">
      <div className="collection-card-image-container">
        <img
          src={collection.thumbnail}
          alt={collection.name}
          className="collection-card-image"
          loading="lazy"
        />
        <div className="collection-card-overlay">
          <div className="collection-card-content">
            <h3 className="collection-card-title">{collection.name}</h3>
            <p className="collection-card-description">{collection.description}</p>
            <span className="collection-card-cta">
              Explore Collection →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;