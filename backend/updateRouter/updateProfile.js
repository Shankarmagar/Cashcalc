const express = require("express");
const userData = require("../mongoDB/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status  (400).json({ message: "Invalid Token" });
  }
};

// Update username route
router.post("/update-username", verifyToken, async (req, res) => {
  const { username } = req.body;

  try {
    // Update the user's username
    const updatedUser = await userData.findOneAndUpdate(
      { email: req.user.email },
      { $set: { username: username } },
      { new: true }
    );

    res.json({ message: "Username updated successfully", updatedUser });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating username" });
  }
});

// Update email and password route
router.post("/update-email-password", verifyToken, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Generate a salt with a specified number of rounds (e.g., 10)
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's email and password
    const updatedUser = await userData.findOneAndUpdate(
      { email: req.user.email },
      { $set: { email: email, password: hashedPassword } },
      { new: true }
    );

    res.json({ message: "Email and password updated successfully", updatedUser });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating email and password" });
  }
});

module.exports = router;
