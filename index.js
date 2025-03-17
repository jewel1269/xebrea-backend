const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

//middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://xebraa-frontend.vercel.app"],
  })
);
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./src/routes/user.route.js");
const noteRoutes = require("./src/routes/note.routes.js");
const ConnectDb = require("./src/config/db");

//database connet
const uri = process.env.MONGO_URI;
ConnectDb(uri);

//routes
app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

const notes = {};

io.on("connection", (socket) => {
  socket.on("joinNote", (noteId) => {
    socket.join(noteId);
  });

  socket.on("editNote", ({ noteId, content }) => {
    notes[noteId] = content;
    io.to(noteId).emit("updateNote", content);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
