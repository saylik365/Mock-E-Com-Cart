const express = require("express");
const { v4: uuidv4 } = require("uuid");

module.exports = function (db) {
  const router = express.Router();

  // Checkout route
  router.post("/", async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email)
        return res.status(400).json({ ok: false, error: "Missing name or email" });

      const cartItems = await db.all("SELECT * FROM cart_items");
      if (!cartItems.length)
        return res.status(400).json({ ok: false, error: "Cart is empty" });

      const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      const payload = JSON.stringify(cartItems);
      const id = uuidv4();
      const createdAt = new Date().toISOString();

      await db.run(
        "INSERT INTO receipts (id, userId, total, payload, createdAt) VALUES (?, ?, ?, ?, ?)",
        id,
        email,
        total,
        payload,
        createdAt
      );

      // Clear cart after checkout
      await db.run("DELETE FROM cart_items");

      res.json({
        ok: true,
        message: "Checkout successful",
        receipt: { id, total, createdAt, items: cartItems },
      });
    } catch (err) {
      console.error("Checkout error:", err);
      res.status(500).json({ ok: false, error: "Checkout failed" });
    }
  });

  // Get Order History
  router.get("/history/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const receipts = await db.all(
        "SELECT * FROM receipts WHERE userId = ? ORDER BY createdAt DESC",
        email
      );
      res.json({ ok: true, receipts });
    } catch (err) {
      console.error("History fetch error:", err);
      res.status(500).json({ ok: false, error: "Failed to fetch history" });
    }
  });

  // Reorder items from a previous order
  router.post("/reorder/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const receipt = await db.get("SELECT * FROM receipts WHERE id = ?", id);
      if (!receipt)
        return res.status(404).json({ ok: false, error: "Order not found" });

      const items = JSON.parse(receipt.payload);
      for (const item of items) {
        await db.run(
          "INSERT INTO cart_items (id, productId, name, price, qty, image) VALUES (?, ?, ?, ?, ?, ?)",
          uuidv4(),
          item.productId,
          item.name,
          item.price,
          item.qty,
          item.image
        );
      }

      res.json({ ok: true, message: "Reorder added to cart" });
    } catch (err) {
      console.error("Reorder error:", err);
      res.status(500).json({ ok: false, error: "Reorder failed" });
    }
  });

  return router;
};
