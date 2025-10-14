// File: ./frontend/src/pages/BlogPostPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug } from '../services/blogService';
import Loader from '../components/common/Loader';
import { formatDate, scrollToTop } from '../utils/helpers';
import './BlogPostPage.css';

const BlogPostPage = () => {
  const { blogSlug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchBlog();
  }, [blogSlug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await getBlogBySlug(blogSlug);
      setBlog(response.data);
    } catch (err) {
      setError('Failed to load blog post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!blog) return <div className="error-message">Blog post not found</div>;

  return (
    <div className="blog-post-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/blog" className="breadcrumb-link">Blog</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{blog.title}</span>
        </nav>

        {/* Blog Post */}
        <article className="blog-post">
          {/* Header */}
          <header className="blog-post-header">
            {blog.category && (
              <span className="post-category">{blog.category}</span>
            )}
            <h1 className="post-title">{blog.title}</h1>
            
            <div className="post-meta">
              <span className="post-author">By {blog.author}</span>
              <span className="meta-separator">•</span>
              <span className="post-date">{formatDate(blog.publishedAt || blog.createdAt)}</span>
              {blog.views > 0 && (
                <>
                  <span className="meta-separator">•</span>
                  <span className="post-views">{blog.views} views</span>
                </>
              )}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="post-tags">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          <div className="post-featured-image">
            <img src={blog.featuredImage} alt={blog.title} />
          </div>

          {/* Content */}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Back to Blog */}
        <div className="blog-navigation">
          <Link to="/blog" className="btn btn-secondary">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;