// File: ./frontend/src/pages/Blog.jsx

import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import Loader from '../components/common/Loader';
import { scrollToTop } from '../utils/helpers';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs();
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to load blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="blog-page">
      <div className="container">
        {/* Page Header */}
        <div className="blog-header">
          <h1 className="blog-title">Fashion Blog</h1>
          <p className="blog-subtitle">
            Stay updated with the latest fashion trends, styling tips, and industry insights
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs.length > 0 ? (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="no-blogs">
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;