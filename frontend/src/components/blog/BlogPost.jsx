// File: ./frontend/src/components/blog/BlogPost.jsx

import React from 'react';
import { formatDate } from '../../utils/helpers';
import './BlogPost.css';

const BlogPost = ({ blog }) => {
  return (
    <article className="blog-post-component">
      {/* Post Header */}
      <header className="blog-post-header">
        {blog.category && (
          <span className="blog-post-category">{blog.category}</span>
        )}
        <h1 className="blog-post-title">{blog.title}</h1>
        
        <div className="blog-post-meta">
          <span className="author">By {blog.author || 'Corporate Pehnawa'}</span>
          <span className="separator">•</span>
          <span className="date">{formatDate(blog.publishedAt || blog.createdAt)}</span>
          {blog.views > 0 && (
            <>
              <span className="separator">•</span>
              <span className="views">{blog.views} views</span>
            </>
          )}
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-post-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="blog-post-image">
          <img src={blog.featuredImage} alt={blog.title} />
        </div>
      )}

      {/* Post Content */}
      <div 
        className="blog-post-content" 
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </article>
  );
};

export default BlogPost;