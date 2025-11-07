const express = require("express");
// const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

module.exports = function (db) {
  const router = express.Router();

  // Ensure table exists
  async function ensureTable() {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        productId INTEGER,
        name TEXT,
        price REAL,
        qty INTEGER,
        image TEXT
      );
    `);
  }

  // GET all cart items
  router.get("/", async (req, res) => {
    try {
      await ensureTable();
      const items = await db.all("SELECT * FROM cart_items");
      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      res.json({ ok: true, cart: items, total });
    } catch (err) {
      console.error("Cart fetch error:", err);
      res.status(500).json({ ok: false, error: "Failed to fetch cart" });
    }
  });

  // Add to cart
router.post("/", async (req, res) => {
  try {
    const { productId, qty } = req.body;
    console.log("🛒 Incoming Add Request:", req.body);

    if (!productId || !qty) {
      console.log("❌ Missing productId or qty");
      return res.status(400).json({ ok: false, error: "Missing productId or qty" });
    }

    await ensureTable();

    console.log("🌍 Fetching product:", `https://fakestoreapi.com/products/${productId}`);
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);

    if (!response.ok) {
      console.log("❌ FakeStoreAPI Error:", response.status);
      return res.status(404).json({ ok: false, error: "Product not found" });
    }

    const product = await response.json();
    console.log("✅ Product Fetched:", product.title);

    const id = uuidv4();
    console.log("💾 Inserting into DB...");

    await db.run(
      "INSERT INTO cart_items (id, productId, name, price, qty, image) VALUES (?, ?, ?, ?, ?, ?)",
      id,
      product.id,
      product.title,
      product.price,
      qty,
      product.image
    );

    console.log("✅ Added to cart successfully");
    res.json({ ok: true, message: "Added to cart" });
  } catch (err) {
    console.error("🔥 Add to cart error:", err);
    res.status(500).json({ ok: false, error: err.message || "Failed to add to cart" });
  }
});


  // Delete cart item
  router.delete("/:id", async (req, res) => {
    try {
      await ensureTable();
      await db.run("DELETE FROM cart_items WHERE id = ?", req.params.id);
      res.json({ ok: true });
    } catch (err) {
      console.error("Delete cart item error:", err);
      res.status(500).json({ ok: false, error: "Failed to delete item" });
    }
  });

  // Update item quantity
router.put("/:id", async (req, res) => {
  try {
    const { qty } = req.body;
    if (!qty || qty < 1) {
      return res.status(400).json({ ok: false, error: "Invalid quantity" });
    }

    await ensureTable();
    const item = await db.get("SELECT * FROM cart_items WHERE id = ?", req.params.id);

    if (!item) {
      return res.status(404).json({ ok: false, error: "Item not found" });
    }

    await db.run("UPDATE cart_items SET qty = ? WHERE id = ?", qty, req.params.id);
    res.json({ ok: true, message: "Quantity updated" });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ ok: false, error: "Failed to update quantity" });
  }
});


  return router;
};
