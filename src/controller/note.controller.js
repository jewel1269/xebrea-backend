const express = require("express");
const authMiddleware = require("../auth/auth");
const Note = require("../model/note.model");

// Create Note
const createNote = async (req, res) => {
  try {
    const { title, content, user } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newNote = new Note({
      title,
      content,
      user,
    });

    console.log(newNote);

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ user: userId });

    if (!notes.length) {
      return res.status(404).json({ message: "No notes found for this user." });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSingleNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    console.log(noteId);

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
// Update Note
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export only available functions
module.exports = { createNote, updateNote, getNotes, getSingleNote };
