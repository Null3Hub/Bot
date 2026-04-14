const express = require('express');
const router = express.Router();
const Script = require('../../models/Script');

router.get('/', async (req, res) => {
  const scripts = await Script.find()
    .select('name placeId features version status image')
    .sort({ name: 1 })
    .lean();

  res.json({ success: true, count: scripts.length, scripts });
});

module.exports = router;
