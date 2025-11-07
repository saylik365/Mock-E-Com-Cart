const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = function (db) {
  const router = express.Router();

  // Register
  router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ ok: false, error: "Missing fields" });

      const hashed = await bcrypt.hash(password, 10);
      const id = uuidv4();

      await db.run(
        "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
        id,
        name,
        email,
        hashed
      );

      const token = jwt.sign({ id, email }, process.env.JWT_SECRET || "secretkey", {
        expiresIn: "1d",
      });

      res.json({ ok: true, token, user: { id, name, email } });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ ok: false, error: "Registration failed" });
    }
  });

  //Login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ ok: false, error: "Missing fields" });

      const user = await db.get("SELECT * FROM users WHERE email = ?", email);
      if (!user)
        return res.status(404).json({ ok: false, error: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ ok: false, error: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1d" }
      );

      res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ ok: false, error: "Login failed" });
    }
  });

  return router;
};
