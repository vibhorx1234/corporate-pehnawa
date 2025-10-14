// File: ./backend/src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getAllProducts);

// GET products by collection slug
router.get('/collection/:collectionSlug', productController.getProductsByCollection);

// GET product by slug
router.get('/slug/:slug', productController.getProductBySlug);

// GET product by ID
router.get('/:id', productController.getProductById);

// POST create new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;