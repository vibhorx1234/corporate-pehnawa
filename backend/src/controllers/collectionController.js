// File: ./backend/src/controllers/collectionController.js

const Collection = require('../models/Collection');

// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const { featured, active } = req.query;
    let query = {};
    
    if (featured === 'true') query.featured = true;
    if (active !== undefined) query.active = active === 'true';
    
    const collections = await Collection.find(query).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collections',
      error: error.message
    });
  }
};

// Get single collection by slug
exports.getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collection',
      error: error.message
    });
  }
};

// Get collection by ID
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collection',
      error: error.message
    });
  }
};

// Create new collection
exports.createCollection = async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating collection',
      error: error.message
    });
  }
};

// Update collection
exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Collection updated successfully',
      data: collection
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating collection',
      error: error.message
    });
  }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting collection',
      error: error.message
    });
  }
};