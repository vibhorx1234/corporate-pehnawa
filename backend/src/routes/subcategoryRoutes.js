const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');

// GET subcategories for a collection
router.get('/collection/:collectionSlug', subcategoryController.getSubcategoriesByCollection);

// GET single subcategory
router.get('/collection/:collectionSlug/:subcategorySlug', subcategoryController.getSubcategoryBySlug);

// Admin CRUD
router.post('/', subcategoryController.createSubcategory);
router.put('/:id', subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;