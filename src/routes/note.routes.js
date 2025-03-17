const express = require("express");
const authMiddleware = require("../auth/auth.js");
const { createNote, updateNote, getNotes, getSingleNote } = require("../controller/note.controller.js");
const router = express.Router();

router.post("/create", createNote);
router.get("/:userId", authMiddleware,  getNotes)
router.get("/single/:noteId", authMiddleware, getSingleNote);
router.put("/update/:noteId", updateNote);

module.exports = router;
