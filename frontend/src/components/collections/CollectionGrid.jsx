// File: ./frontend/src/components/collections/CollectionGrid.jsx

import React from 'react';
import CollectionCard from './CollectionCard';
import './CollectionGrid.css';

const CollectionGrid = ({ collections }) => {
  if (!collections || collections.length === 0) {
    return (
      <div className="no-collections-message">
        <p>No collections available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="collection-grid">
      {collections.map((collection) => (
        <CollectionCard key={collection._id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionGrid;