const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { REFRESH_SECRET, SECRET_KEY } = require("../config/config");
const User = require("../model/user.model");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, { httpOnly: true });
  res.status(200).json({
    success:true,
    message:"Login Successfull",
    user,
    accessToken,
  });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccessToken });
  });
});

router.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
