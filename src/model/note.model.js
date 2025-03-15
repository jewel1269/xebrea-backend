const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
