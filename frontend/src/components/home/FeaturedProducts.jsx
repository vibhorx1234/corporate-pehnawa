// File: ./frontend/src/components/home/FeaturedProducts.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../services/productService';
import ProductCard from '../products/ProductCard';
import Loader from '../common/Loader';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await getFeaturedProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load featured products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (products.length === 0) return null;

  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-titlee">Featured Products</h2>
          {/* <p className="section-subtitle">
            Discover our handpicked selection of premium fashion pieces
          </p> */}
        </div>

        <div className="products-gridd">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="section-footer">
          <Link to="/collections" className="btn btn-secondary btn-lg">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;