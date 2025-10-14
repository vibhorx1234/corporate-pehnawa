// File: ./backend/src/routes/blogRoutes.js

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// GET all blogs
router.get('/', blogController.getAllBlogs);

// GET recent blogs
router.get('/recent', blogController.getRecentBlogs);

// GET blog by slug
router.get('/slug/:slug', blogController.getBlogBySlug);

// GET blog by ID
router.get('/:id', blogController.getBlogById);

// POST create new blog
router.post('/', blogController.createBlog);

// PUT update blog
router.put('/:id', blogController.updateBlog);

// DELETE blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;