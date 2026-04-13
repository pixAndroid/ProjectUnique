const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pageview', 'click', 'service_view', 'product_view'],
    required: true
  },
  page: { type: String, default: '' },
  referenceId: { type: String, default: '' },
  referenceType: { type: String, default: '' },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
