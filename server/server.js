const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const eventsRouter = require("./src/routes/events.route");
const roomsRouter = require("./src/routes/rooms.route");
const questionsRouter = require("./src/routes/questions.route");
const sessionsRouter = require("./src/routes/session.route");
const speakersRouter = require("./src/routes/speaker.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

// API Routes
app.use("/api/events", eventsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api", questionsRouter);
app.use("/api", sessionsRouter);
app.use("/api/speakers", speakersRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
