// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { init } = require('./db-init');

const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'db', 'database.sqlite');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

(async () => {
  const db = await init(DB_PATH);
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // attach req.user if valid JWT present
  const jwt = require('jsonwebtoken');
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
      } catch (e) {
        // invalid token => ignore user
      }
    }
    next();
  });

  // mount routes
  app.use('/api/auth', require('./routes/auth')(db, JWT_SECRET));
  app.use('/api/products', require('./routes/products')(db));
  app.use('/api/cart', require('./routes/cart')(db));

  // Checkout route
  app.post('/api/checkout', async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) return res.status(400).json({ ok:false, error:'Name & email required' });

      const userId = req.user?.id || null;
      const items = await db.all(`
        SELECT c.id, c.productId, c.qty, p.name, p.price
        FROM cart_items c
        LEFT JOIN products p ON p.id = c.productId
        WHERE c.userId IS ?
      `, userId);

      if (!items.length) return res.status(400).json({ ok:false, error:'Cart empty' });

      const total = items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);
      const { v4: uuidv4 } = require('uuid');
      const receiptId = uuidv4();
      await db.run('INSERT INTO receipts (id,userId,total,createdAt,name,email,payload) VALUES (?,?,?,?,?,?,?)',
        receiptId, userId, total, new Date().toISOString(), name, email, JSON.stringify(items));
      await db.run('DELETE FROM cart_items WHERE userId IS ?', userId);

      res.json({ ok:true, receipt: { id: receiptId, items, total, createdAt: new Date().toISOString(), name, email } });
    } catch (err) {
      console.error('Checkout error:', err);
      res.status(500).json({ ok:false, error:'Checkout failed' });
    }
  });

  // health
  app.get('/api/health', (req, res) => res.json({ ok:true, uptime: process.uptime() }));

  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
})();
