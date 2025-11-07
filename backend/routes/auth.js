// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports = function (db, JWT_SECRET) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ ok:false, error:'Missing fields' });

      const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
      if (existing) return res.status(409).json({ ok:false, error:'Email already in use' });

      const hashed = await bcrypt.hash(password, 10);
      const id = uuidv4();
      await db.run('INSERT INTO users (id,name,email,password) VALUES (?,?,?,?)', id, name, email, hashed);
      const token = jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '4h' });
      res.json({ ok:true, user: { id, name, email }, token });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ ok:false, error:'Register failed' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ ok:false, error:'Missing fields' });

      const user = await db.get('SELECT * FROM users WHERE email = ?', email);
      if (!user) return res.status(404).json({ ok:false, error:'User not found' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ ok:false, error:'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '4h' });
      res.json({ ok:true, token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ ok:false, error:'Login failed' });
    }
  });

  return router;
};
