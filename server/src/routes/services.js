const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// GET /api/services - public
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { published: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/services/:id - public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    service.views += 1;
    await service.save();
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/services - protected
router.post('/admin/services', auth, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service, message: 'Service created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/services/:id - protected
router.put('/admin/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    await service.update(req.body);
    res.json({ success: true, data: service, message: 'Service updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/services/:id - protected
router.delete('/admin/services/:id', auth, async (req, res) => {
  try {
    const deleted = await Service.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/services - protected list all
router.get('/admin/services', auth, async (req, res) => {
  try {
    const services = await Service.findAll({ order: [['order', 'ASC'], ['createdAt', 'DESC']] });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

