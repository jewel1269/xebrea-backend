const express = require("express");
const { Signup, Login, LogOut, getUser } = require("../controller/user.controller");
const authMiddleware = require("../auth/auth");
const router = express.Router();

router.post("/create-user", Signup);
router.post("/login", Login);
router.get("/user", authMiddleware,  getUser);
router.post("/logout", LogOut);

module.exports = router;
