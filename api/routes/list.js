const express = require('express');
const router = express.Router();
const Script = require('../../models/Script');

// GET /api/list
router.get('/', async (req, res) => {
  const scripts = await Script.find({ status: 'active' })
    .select('name placeId features version')
    .sort({ name: 1 })
    .lean();

  res.json({ success: true, count: scripts.length, scripts });
});

module.exports = router;
