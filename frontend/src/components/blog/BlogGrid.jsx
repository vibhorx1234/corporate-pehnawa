// File: ./frontend/src/components/blog/BlogGrid.jsx

import React from 'react';
import BlogCard from './BlogCard';
import './BlogGrid.css';

const BlogGrid = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="no-blogs-message">
        <p>No blog posts available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogGrid;