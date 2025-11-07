require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const authRoutes = require("./routes/auth"); 
// const orderRoutes = require("./routes/orders"); 

// Database setup
let db;

(async () => {
  db = await open({
    filename: "./db/database.sqlite",
    driver: sqlite3.Database,
  });

  console.log("Connected to SQLite database");

  // Create tables if missing
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      productId INTEGER,
      name TEXT,
      price REAL,
      qty INTEGER,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      total REAL,
      payload TEXT,
      createdAt TEXT
    );
  `);

  // Mount routes AFTER db is ready
  app.use("/api/products", productRoutes(db));
  app.use("/api/cart", cartRoutes(db));
  app.use("/api/auth", authRoutes(db));
  app.use("/api/checkout", checkoutRoutes(db));
  // app.use("/api/orders", orderRoutes(db)); // coming next

  // Default route
  app.get("/", (req, res) => {
    res.send("Vibe Commerce Backend Running...");
  });

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
})();
