// File: ./backend/src/controllers/addressController.js

const Address = require('../models/Address');

// GET /api/addresses  (protected)
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: addresses.length, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching addresses.', error: error.message });
  }
};

// POST /api/addresses  (protected)
exports.addAddress = async (req, res) => {
  try {
    const { label, recipientName, phone, street, city, state, pincode, country, isDefault } = req.body;

    // If this is the user's first address, make it default automatically
    const existingCount = await Address.countDocuments({ user: req.user._id });
    const shouldBeDefault = isDefault || existingCount === 0;

    const address = await Address.create({
      user: req.user._id,
      label, recipientName, phone, street, city, state, pincode, country,
      isDefault: shouldBeDefault
    });

    res.status(201).json({ success: true, message: 'Address added successfully.', data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error adding address.', error: error.message });
  }
};

// PATCH /api/addresses/:id  (protected)
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });

    const allowedFields = ['label', 'recipientName', 'phone', 'street', 'city', 'state', 'pincode', 'country', 'isDefault'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) address[field] = req.body[field];
    });

    await address.save();
    res.status(200).json({ success: true, message: 'Address updated successfully.', data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating address.', error: error.message });
  }
};

// PATCH /api/addresses/:id/set-default  (protected)
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });

    address.isDefault = true;
    await address.save(); // pre-save hook unsets other defaults

    res.status(200).json({ success: true, message: 'Default address updated.', data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error setting default address.', error: error.message });
  }
};

// DELETE /api/addresses/:id  (protected)
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });

    // If deleted address was default, make the most recent remaining one default
    if (address.isDefault) {
      const next = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (next) { next.isDefault = true; await next.save(); }
    }

    res.status(200).json({ success: true, message: 'Address deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting address.', error: error.message });
  }
};