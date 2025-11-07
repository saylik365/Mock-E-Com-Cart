const express = require("express");
const fetch = require("node-fetch");

module.exports = function (db) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products?limit=10");
      const products = await response.json();
      res.json({ ok: true, products });
    } catch (err) {
      console.error("Fetch products error:", err);
      res.status(500).json({ ok: false, error: "Failed to load products" });
    }
  });

  return router;
};
