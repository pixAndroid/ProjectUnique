const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { addClient, removeClient, broadcast } = require('../lib/sseBroadcast');

// Helper to verify token from query param (used by SSE since EventSource cannot set headers)
async function verifyTokenParam(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    return user || null;
  } catch {
    return null;
  }
}

// GET /api/admin/notifications/stream – SSE stream (token passed as ?token=)
router.get('/admin/notifications/stream', async (req, res) => {
  const user = await verifyTokenParam(req.query.token);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Send a heartbeat comment every 25 s to keep the connection alive through proxies
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch { /* ignore */ }
  }, 25000);

  addClient(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeClient(res);
  });
});

// GET /api/admin/notifications – list (most recent 50)
router.get('/admin/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    const unreadCount = await Notification.count({ where: { read: false } });
    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/notifications/:id/read – mark single as read
router.put('/admin/notifications/:id/read', auth, async (req, res) => {
  try {
    const n = await Notification.findByPk(req.params.id);
    if (!n) return res.status(404).json({ success: false, message: 'Not found' });
    await n.update({ read: true });
    res.json({ success: true, data: n });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/notifications/read-all – mark all as read
router.put('/admin/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.update({ read: true }, { where: { read: false } });
    res.json({ success: true, message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/notifications/clear – delete all
router.delete('/admin/notifications/clear', auth, async (req, res) => {
  try {
    await Notification.destroy({ where: {} });
    res.json({ success: true, message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
