const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { broadcast } = require('../lib/sseBroadcast');
const { crossedMilestone, milestone } = require('../lib/milestones');

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
    const prevViews = service.views;
    service.views += 1;
    await service.save();
    if (crossedMilestone(prevViews, service.views)) {
      const notification = await Notification.create({
        type: 'milestone_view',
        message: `Service "${service.title}" reached ${milestone(service.views)} views`,
        meta: { serviceId: service.id, title: service.title, count: service.views }
      });
      broadcast('notification', { notification });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/services/:id/click - public (track click count)
router.post('/:id/click', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    const prevClicks = service.clickCount;
    service.clickCount += 1;
    await service.save();
    if (crossedMilestone(prevClicks, service.clickCount)) {
      const notification = await Notification.create({
        type: 'milestone_click',
        message: `Service "${service.title}" reached ${milestone(service.clickCount)} clicks`,
        meta: { serviceId: service.id, title: service.title, count: service.clickCount }
      });
      broadcast('notification', { notification });
    }
    res.json({ success: true });
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

// GET /api/admin/services/:id - protected single service by id
router.get('/admin/services/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid service ID' });
    }
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

