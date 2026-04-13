const express = require('express');
const router = express.Router();
const Script = require('../../models/Script');
const cache = require('../../services/cache');

// GET /api/scripts/:placeId
router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;
  const cacheKey = `script:${placeId}`;
  
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const script = await Script.findOne({ placeId }).lean();
  
  if (!script) {
    return res.status(404).json({ success: false, error: 'Script not found' });
  }

  const payload = {
    success: true,
    name: script.name,
    placeId: script.placeId,
    status: script.status,
    version: `v${script.version}`,
    features: script.features,
    rawUrl: script.rawUrl, // URL para o Loader baixar o script do GitHub
  };

  cache.set(cacheKey, payload);
  res.json(payload);
});

module.exports = router;
