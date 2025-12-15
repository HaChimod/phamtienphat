const express = require("express");
const router = express.Router();
const User = require("../db/userModel");
const jwt = require("jsonwebtoken");

const SECRET = "mySecretKey12345";

/**
 * POST /login
 * Trả về JWT
 */
router.post("/login", async (req, res) => {
  const { login_name, password } = req.body;

  if (!login_name || !password) {
    return res.status(400).json({ message: "Missing login_name or password" });
  }

  try {
    const user = await User.findOne({ login_name }).lean();

    if (!user || user.password !== password) {
      return res
        .status(400)
        .json({ message: "Invalid login name or password" });
    }

    // 👉 TẠO TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        login_name: user.login_name,
      },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /me
 * Lấy info user từ token
 */
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

/**
 * POST /logout
 * JWT không cần destroy, frontend tự xoá token
 */
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out (client removes token)" });
});

/**
 * POST /user (register)
 */
router.post("/user", async (req, res) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).send("Missing required fields");
  }

  const already = await User.findOne({ login_name }).lean();
  if (already) {
    return res.status(400).send("Login name already exists");
  }

  try {
    const newUser = await User.create({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    res.status(201).json({ login_name: newUser.login_name });
  } catch (err) {
    res.status(400).send("Failed to create user");
  }
});

module.exports = router;
