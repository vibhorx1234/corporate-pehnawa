// File: ./frontend/src/components/products/ProductGrid.jsx

import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products-message">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;