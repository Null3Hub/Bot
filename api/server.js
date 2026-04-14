require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('../services/mongo');

const app = express();

// ✅ CRUCIAL PARA RAILWAY (Trust Proxy)
app.set('trust proxy', 1);

// 🔐 CORS Configurado com variável de ambiente
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',           // Dev frontend
      'website-production-ef6e.up.railway.app',           // Dev frontend alternativo
      process.env.FRONTEND_URL,          // Produção: ex: https://nullhub-site.up.railway.app
      undefined                          // Permite requests sem origin (Poastman, curl, mobile apps)
    ].filter(Boolean); // Remove undefined se FRONTEND_URL não estiver setado
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqueado para origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ Rate Limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // 100 requests por windowMs por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Muitas requisições. Tente novamente mais tarde.' },
}));

// 📦 Rotas
app.use('/api/scripts', require('./routes/scripts'));
app.use('/api/list', require('./routes/list'));

// ❤️ Health Check (com mais detalhes)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 🎯 Rota base
app.get('/', (req, res) => {
  res.json({
    name: 'NullHub API',
    version: '1.0.0',
    endpoints: {
      scripts: '/api/scripts',
      list: '/api/list',
      health: '/health'
    }
  });
});

// ❌ Error Handler
app.use((err, _req, res, _next) => {
  console.error('[API ERROR]', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// 🚀 Start Server
const PORT = process.env.API_PORT || process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API running on port ${PORT}`);
    console.log(`🔗 CORS allowed for: ${process.env.FRONTEND_URL || 'localhost'}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});

module.exports = app;
