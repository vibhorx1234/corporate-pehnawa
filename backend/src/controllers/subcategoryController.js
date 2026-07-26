const Subcategory = require('../models/Subcategory');
const Collection = require('../models/Collection');

// Get all subcategories for a given collection (by collection slug)
exports.getSubcategoriesByCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.collectionSlug });

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    const subcategories = await Subcategory.find({
      collection: collection._id,
      active: true
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: subcategories.length,
      collection,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subcategories', error: error.message });
  }
};

// Get single subcategory by collection slug + subcategory slug
exports.getSubcategoryBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.collectionSlug });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    const subcategory = await Subcategory.findOne({
      collection: collection._id,
      slug: req.params.subcategorySlug
    });

    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subcategory', error: error.message });
  }
};

// Create subcategory (admin)
exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.create(req.body); // body needs: name, thumbnail, collection, description?
    res.status(201).json({ success: true, message: 'Subcategory created successfully', data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating subcategory', error: error.message });
  }
};

// Update subcategory (admin)
exports.updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }
    res.status(200).json({ success: true, message: 'Subcategory updated successfully', data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating subcategory', error: error.message });
  }
};

// Delete subcategory (admin)
exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }
    res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting subcategory', error: error.message });
  }
};