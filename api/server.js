require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('../services/mongo');

const app = express();

// ✅ CRUCIAL PARA RAILWAY (Trust Proxy)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Rate Limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Muitas requisições. Tente novamente mais tarde.' },
}));

// Rotas
app.use('/api/scripts', require('./routes/scripts'));
app.use('/api/list', require('./routes/list'));

// Health Check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Error Handler
app.use((err, _req, res, _next) => {
  console.error('[API ERROR]', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

const PORT = process.env.API_PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
});

module.exports = app;
