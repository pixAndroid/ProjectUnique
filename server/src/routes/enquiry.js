const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { broadcast } = require('../lib/sseBroadcast');

// POST /api/enquiry - public
router.post('/enquiry', async (req, res) => {
  try {
    const { name, phone, email, serviceRequired, message } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const enquiry = await Enquiry.create({ name, phone, email, serviceRequired, message });

    // Create notification and broadcast to admin SSE clients
    const newEnquiriesCount = await Enquiry.count({ where: { status: 'new' } });
    const notification = await Notification.create({
      type: 'new_enquiry',
      message: `New enquiry from ${name}${serviceRequired ? ` for ${serviceRequired}` : ''}`,
      meta: { enquiryId: enquiry.id, name, serviceRequired }
    });
    broadcast('new_enquiry', { notification, newEnquiriesCount });

    res.status(201).json({ success: true, data: enquiry, message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/enquiries - protected
router.get('/admin/enquiries', auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/enquiries/:id - protected
router.put('/admin/enquiries/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    await enquiry.update({ status: req.body.status });
    res.json({ success: true, data: enquiry, message: 'Status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

