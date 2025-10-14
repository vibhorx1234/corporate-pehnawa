// File: ./frontend/src/components/blog/BlogCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import './BlogCard.css';

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.slug}`} className="blog-card">
      <div className="blog-image-container">
        <img 
          src={blog.featuredImage} 
          alt={blog.title}
          className="blog-image"
          loading="lazy"
        />
        {blog.category && (
          <span className="blog-category">{blog.category}</span>
        )}
      </div>

      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-date">{formatDate(blog.publishedAt || blog.createdAt)}</span>
          {blog.views > 0 && (
            <>
              <span className="blog-separator">•</span>
              <span className="blog-views">{blog.views} views</span>
            </>
          )}
        </div>

        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-excerpt">{blog.excerpt}</p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="blog-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="blog-footer">
          <span className="read-more">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;