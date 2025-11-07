// db-init.js
const fs = require('fs');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

async function init(dbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  // Create tables (allow userId NULL to permit anonymous flow if not logged in)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      price REAL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    qty INTEGER
  );
`);


await db.exec(`
  CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    total REAL,
    name TEXT,
    email TEXT,
    payload TEXT,
    createdAt TEXT
  );
`);


  // seed products if empty
  const row = await db.get('SELECT COUNT(1) as c FROM products');
  if (row.c === 0) {
    const { v4: uuidv4 } = require('uuid');
    const items = [
      { name: 'Vibe Sneakers', price: 49.99, description: 'Comfort sneakers' },
      { name: 'Vibe Hoodie', price: 39.99, description: 'Cozy hoodie' },
      { name: 'Vibe Backpack', price: 59.99, description: 'All-purpose backpack' },
      { name: 'Vibe Water Bottle', price: 12.5, description: 'Stainless steel bottle' },
      { name: 'Vibe Headphones', price: 89.0, description: 'Wireless headphones' },
      { name: 'Vibe Cap', price: 14.99, description: 'Stylish cap' }
    ];
    const stmt = await db.prepare('INSERT INTO products (id,name,description,price) VALUES (?,?,?,?)');
    for (const p of items) {
      await stmt.run(uuidv4(), p.name, p.description, p.price);
    }
    await stmt.finalize();
    console.log('Seeded products');
  }

  return db;
}

module.exports = { init };
