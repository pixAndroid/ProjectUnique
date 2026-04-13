const express = require('express');
const router = express.Router();
const { QueryTypes, Op } = require('sequelize');
const sequelize = require('../db');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

// POST /api/track - public
router.post('/track', async (req, res) => {
  try {
    const { type, page, referenceId, referenceType } = req.body;
    const event = await Analytics.create({
      type: type || 'pageview',
      page: page || '',
      referenceId: referenceId || '',
      referenceType: referenceType || '',
      ip: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date()
    });
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

    // Total counts
    const totalPageviews = await Analytics.count({ where: { type: 'pageview' } });
    const recentPageviews = await Analytics.count({
      where: { type: 'pageview', timestamp: { [Op.gte]: thirtyDaysAgo } }
    });

    // Daily pageviews for last 30 days
    const dailyPageviews = await sequelize.query(
      `SELECT TO_CHAR("timestamp", 'YYYY-MM-DD') AS "_id", COUNT(*) AS count
       FROM analytics
       WHERE type = 'pageview' AND "timestamp" >= :thirtyDaysAgo
       GROUP BY TO_CHAR("timestamp", 'YYYY-MM-DD')
       ORDER BY "_id" ASC`,
      { replacements: { thirtyDaysAgo }, type: QueryTypes.SELECT }
    );

    // Top pages
    const topPages = await sequelize.query(
      `SELECT page AS "_id", COUNT(*) AS count
       FROM analytics
       WHERE type = 'pageview' AND "timestamp" >= :thirtyDaysAgo
       GROUP BY page
       ORDER BY count DESC
       LIMIT 10`,
      { replacements: { thirtyDaysAgo }, type: QueryTypes.SELECT }
    );

    // Top services clicked
    const topServices = await sequelize.query(
      `SELECT "referenceId" AS "_id", COUNT(*) AS count
       FROM analytics
       WHERE type = 'service_view' AND "timestamp" >= :thirtyDaysAgo
       GROUP BY "referenceId"
       ORDER BY count DESC
       LIMIT 5`,
      { replacements: { thirtyDaysAgo }, type: QueryTypes.SELECT }
    );

    // Top products clicked
    const topProducts = await sequelize.query(
      `SELECT "referenceId" AS "_id", COUNT(*) AS count
       FROM analytics
       WHERE type = 'product_view' AND "timestamp" >= :thirtyDaysAgo
       GROUP BY "referenceId"
       ORDER BY count DESC
       LIMIT 5`,
      { replacements: { thirtyDaysAgo }, type: QueryTypes.SELECT }
    );

    // Unique visitors (by IP) last 30 days
    const uniqueVisitors = await Analytics.count({
      distinct: true,
      col: 'ip',
      where: { timestamp: { [Op.gte]: thirtyDaysAgo } }
    });

    // Cast string counts from raw SQL to numbers
    const toNum = rows => rows.map(r => ({ ...r, count: parseInt(r.count, 10) }));

    res.json({
      success: true,
      data: {
        totalPageviews,
        recentPageviews,
        uniqueVisitors,
        dailyPageviews: toNum(dailyPageviews),
        topPages: toNum(topPages),
        topServices: toNum(topServices),
        topProducts: toNum(topProducts)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

