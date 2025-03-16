const express = require("express");
const { Signup, Login, LogOut, getUser } = require("../controller/user.controller");
const router = express.Router();

router.post("/create-user", Signup);
router.post("/login", Login);
router.get("/user", getUser);
router.post("/logout", LogOut);

module.exports = router;
