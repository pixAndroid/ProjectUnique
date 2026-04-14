const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { broadcast } = require('../lib/sseBroadcast');

// GET /api/blogs - public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tag = req.query.tag;
    const where = { published: true };
    if (tag) where.tags = { [Op.contains]: [tag] };
    const { count: total, rows: blogs } = await Blog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit
    });
    res.json({ success: true, data: { blogs, total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/blogs/:slug - public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug, published: true } });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/blogs - protected
router.post('/admin/blogs', auth, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    if (blog.published) {
      const notification = await Notification.create({
        type: 'blog_published',
        message: `Blog "${blog.title}" was published`,
        meta: { blogId: blog.id, title: blog.title }
      });
      broadcast('notification', { notification });
    }
    res.status(201).json({ success: true, data: blog, message: 'Blog created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/blogs/:id - protected
router.put('/admin/blogs/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    const wasPublished = blog.published;
    await blog.update(req.body);
    if (!wasPublished && blog.published) {
      // Just got published
      const notification = await Notification.create({
        type: 'blog_published',
        message: `Blog "${blog.title}" was published`,
        meta: { blogId: blog.id, title: blog.title }
      });
      broadcast('notification', { notification });
    } else if (blog.published) {
      // Edited while published
      const notification = await Notification.create({
        type: 'blog_edited',
        message: `Blog "${blog.title}" was updated`,
        meta: { blogId: blog.id, title: blog.title }
      });
      broadcast('notification', { notification });
    }
    res.json({ success: true, data: blog, message: 'Blog updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/blogs/:id - protected
router.delete('/admin/blogs/:id', auth, async (req, res) => {
  try {
    const deleted = await Blog.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/blogs - protected list all
router.get('/admin/blogs', auth, async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

