const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

// POST /api/track - public
router.post('/track', async (req, res) => {
  try {
    const { type, page, referenceId, referenceType } = req.body;
    const event = new Analytics({
      type: type || 'pageview',
      page: page || '',
      referenceId: referenceId || '',
      referenceType: referenceType || '',
      ip: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date()
    });
    await event.save();
    res.json({ success: true, message: 'Event tracked' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/analytics - protected
router.get('/admin/analytics', auth, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total counts
    const totalPageviews = await Analytics.countDocuments({ type: 'pageview' });
    const recentPageviews = await Analytics.countDocuments({ type: 'pageview', timestamp: { $gte: thirtyDaysAgo } });

    // Daily pageviews for last 30 days
    const dailyPageviews = await Analytics.aggregate([
      { $match: { type: 'pageview', timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top pages
    const topPages = await Analytics.aggregate([
      { $match: { type: 'pageview', timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top services clicked
    const topServices = await Analytics.aggregate([
      { $match: { type: 'service_view', timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$referenceId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Top products clicked
    const topProducts = await Analytics.aggregate([
      { $match: { type: 'product_view', timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$referenceId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Unique visitors (by IP) last 30 days
    const uniqueVisitors = await Analytics.distinct('ip', { timestamp: { $gte: thirtyDaysAgo } });

    res.json({
      success: true,
      data: {
        totalPageviews,
        recentPageviews,
        uniqueVisitors: uniqueVisitors.length,
        dailyPageviews,
        topPages,
        topServices,
        topProducts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
