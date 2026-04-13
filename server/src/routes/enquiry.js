const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const auth = require('../middleware/auth');

// POST /api/enquiry - public
router.post('/enquiry', async (req, res) => {
  try {
    const { name, phone, email, serviceRequired, message } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const enquiry = new Enquiry({ name, phone, email, serviceRequired, message });
    await enquiry.save();
    res.status(201).json({ success: true, data: enquiry, message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/enquiries - protected
router.get('/admin/enquiries', auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/enquiries/:id - protected
router.put('/admin/enquiries/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry, message: 'Status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
