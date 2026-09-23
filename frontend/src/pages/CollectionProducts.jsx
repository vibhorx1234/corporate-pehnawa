import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductsByCollection } from '../services/productService';
import { getSubcategoriesByCollection } from '../services/subcategoryService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { scrollToTop } from '../utils/helpers';
import './CollectionProducts.css';

const CollectionProducts = () => {
  const { collectionSlug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAndLoad = async () => {
      try {
        setLoading(true);
        const subRes = await getSubcategoriesByCollection(collectionSlug);
        if (subRes.data.length > 0) {
          navigate(`/collections/${collectionSlug}/subcategories`, { replace: true });
          return;
        }
        const response = await getProductsByCollection(collectionSlug);
        setProducts(response.data);
        setCollection(response.collection);
      } catch (err) {
        setError('Failed to load collection');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    scrollToTop();
    checkAndLoad();
  }, [collectionSlug, navigate]);

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