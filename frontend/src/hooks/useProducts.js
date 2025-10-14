// File: ./frontend/src/hooks/useProducts.js

import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';

const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(params)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProducts(params);
      setProducts(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  return { products, loading, error, refetch };
};

export default useProducts;