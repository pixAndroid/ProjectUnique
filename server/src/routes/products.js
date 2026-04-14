const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { broadcast } = require('../lib/sseBroadcast');

// Helper: check if a counter crossed a 100-milestone
function crossedMilestone(before, after) {
  return after > 0 && Math.floor(after / 100) > Math.floor(before / 100);
}
function milestone(value) {
  return Math.floor(value / 100) * 100;
}

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = { published: true };
    if (category) where.category = category;
    const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/:id - public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const prevViews = product.views;
    product.views += 1;
    await product.save();
    if (crossedMilestone(prevViews, product.views)) {
      const notification = await Notification.create({
        type: 'milestone_view',
        message: `Product "${product.title}" reached ${milestone(product.views)} views`,
        meta: { productId: product.id, title: product.title, count: product.views }
      });
      broadcast('notification', { notification });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/products/:id/click - public (track click count)
router.post('/:id/click', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const prevClicks = product.clickCount;
    product.clickCount += 1;
    await product.save();
    if (crossedMilestone(prevClicks, product.clickCount)) {
      const notification = await Notification.create({
        type: 'milestone_click',
        message: `Product "${product.title}" reached ${milestone(product.clickCount)} clicks`,
        meta: { productId: product.id, title: product.title, count: product.clickCount }
      });
      broadcast('notification', { notification });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/products - protected
router.post('/admin/products', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product, message: 'Product created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/products/:id - protected
router.put('/admin/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.update(req.body);
    res.json({ success: true, data: product, message: 'Product updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/products/:id - protected
router.delete('/admin/products/:id', auth, async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/products - protected list all
router.get('/admin/products', auth, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

