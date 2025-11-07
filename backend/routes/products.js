// routes/products.js
const express = require('express');

module.exports = function (db) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const products = await db.all('SELECT id, name, description, price FROM products');
      res.json({ ok:true, products });
    } catch (err) {
      console.error('Products error:', err);
      res.status(500).json({ ok:false, error:'Failed to fetch products' });
    }
  });

  return router;
};
