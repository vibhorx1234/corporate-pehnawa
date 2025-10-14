// File: ./backend/src/routes/collectionRoutes.js

const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// GET all collections
router.get('/', collectionController.getAllCollections);

// GET collection by slug
router.get('/slug/:slug', collectionController.getCollectionBySlug);

// GET collection by ID
router.get('/:id', collectionController.getCollectionById);

// POST create new collection
router.post('/', collectionController.createCollection);

// PUT update collection
router.put('/:id', collectionController.updateCollection);

// DELETE collection
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;