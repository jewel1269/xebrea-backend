const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { REFRESH_SECRET, SECRET_KEY } = require("../config/config");
const User = require("../model/user.model");
const authMiddleware = require("../auth/auth");
const router = express.Router();

const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: "7d", 
  });

  user.token = token;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Login Successfull",
    user,
    token
  });
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const user = await User.findOne({ token }); 
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



const Refesh = async (req, res) => {
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
};

const LogOut = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

module.exports = { Signup, Login, LogOut, Refesh, getUser };
