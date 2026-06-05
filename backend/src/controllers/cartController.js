// File: ./backend/src/controllers/cartController.js

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper — get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name images price discountedPrice inStock slug');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// GET /api/cart  (protected)
exports.getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart.', error: error.message });
  }
};

// POST /api/cart/items  (protected)
// Body: { productId, quantity, sizeType, standardSize?, customMeasurements? }
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1, sizeType, standardSize, customMeasurements } = req.body;

    if (!productId || !sizeType) {
      return res.status(400).json({ success: false, message: 'productId and sizeType are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (!product.inStock) return res.status(400).json({ success: false, message: 'Product is out of stock.' });

    if (sizeType === 'standard' && !standardSize) {
      return res.status(400).json({ success: false, message: 'standardSize is required.' });
    }
    if (sizeType === 'custom' && (!customMeasurements?.bust || !customMeasurements?.waist)) {
      return res.status(400).json({ success: false, message: 'bust and waist measurements are required for custom size.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    // Check if same product + same size config already in cart
    const existingIndex = cart.items.findIndex(item => {
      if (item.product.toString() !== productId) return false;
      if (item.sizeType !== sizeType) return false;
      if (sizeType === 'standard') return item.standardSize === standardSize;
      // For custom, treat as a new line item always
      return false;
    });

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      const price = product.discountedPrice ?? product.price;
      cart.items.push({
        product: product._id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        price,
        quantity: Number(quantity),
        sizeType,
        ...(sizeType === 'standard' ? { standardSize } : { customMeasurements })
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountedPrice inStock slug');

    res.status(200).json({ success: true, message: 'Item added to cart.', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item to cart.', error: error.message });
  }
};

// PATCH /api/cart/items/:itemId  (protected)
// Body: { quantity }
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1. To remove, use DELETE.' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate('items.product', 'name images price discountedPrice inStock slug');

    res.status(200).json({ success: true, message: 'Cart updated.', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart item.', error: error.message });
  }
};

// DELETE /api/cart/items/:itemId  (protected)
exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    item.deleteOne();
    await cart.save();
    await cart.populate('items.product', 'name images price discountedPrice inStock slug');

    res.status(200).json({ success: true, message: 'Item removed from cart.', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing cart item.', error: error.message });
  }
};

// DELETE /api/cart  (protected) — clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart cleared.', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing cart.', error: error.message });
  }
};