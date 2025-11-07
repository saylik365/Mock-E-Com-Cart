// routes/cart.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');

module.exports = function (db) {
  const router = express.Router();

  // helper: user id (if logged in)
  function getUserId(req) {
    return req.user?.id || null;
  }

  router.get('/', async (req, res) => {
    try {
      const userId = getUserId(req);
      const items = await db.all(`
        SELECT c.id, c.productId, c.qty, p.name, p.price
        FROM cart_items c
        LEFT JOIN products p ON p.id = c.productId
        WHERE c.userId IS ?
      `, userId);
      const total = items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);
      res.json({ ok:true, cart: items, total });
    } catch (err) {
      console.error('Get cart error:', err);
      res.status(500).json({ ok:false, error:'Failed to get cart' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { productId, qty = 1 } = req.body;
      if (!productId || !Number.isInteger(qty) || qty <= 0) return res.status(400).json({ ok:false, error:'Invalid payload' });

      const product = await db.get('SELECT id FROM products WHERE id = ?', productId);
      if (!product) return res.status(404).json({ ok:false, error:'Product not found' });

      const userId = getUserId(req);
      const existing = await db.get('SELECT * FROM cart_items WHERE productId = ? AND userId IS ?', productId, userId);
      if (existing) {
        await db.run('UPDATE cart_items SET qty = ? WHERE id = ?', existing.qty + qty, existing.id);
        return res.json({ ok:true, message:'Updated qty' });
      } else {
        const id = uuidv4();
        await db.run('INSERT INTO cart_items (id,userId,productId,qty,createdAt) VALUES (?,?,?,?,?)',
          id, userId, productId, qty, new Date().toISOString());
        return res.json({ ok:true, id });
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      res.status(500).json({ ok:false, error:'Failed to add to cart' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { qty } = req.body;
      if (!Number.isInteger(qty) || qty < 0) return res.status(400).json({ ok:false, error:'Invalid qty' });
      if (qty === 0) {
        await db.run('DELETE FROM cart_items WHERE id = ?', id);
        return res.json({ ok:true, message:'Removed' });
      }
      await db.run('UPDATE cart_items SET qty = ? WHERE id = ?', qty, id);
      res.json({ ok:true });
    } catch (err) {
      console.error('Update cart error:', err);
      res.status(500).json({ ok:false, error:'Failed to update cart' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await db.run('DELETE FROM cart_items WHERE id = ?', id);
      res.json({ ok:true });
    } catch (err) {
      console.error('Delete cart error:', err);
      res.status(500).json({ ok:false, error:'Failed to remove cart item' });
    }
  });

  return router;
};
