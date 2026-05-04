const express = require("express");

const eventsRouter = require("./events.route");
const roomsRouter = require("./rooms.route");
const questionsRouter = require("./questions.route");
const sessionsRouter = require("./session.route");
const speakersRouter = require("./speaker.route");

module.exports = (app) => {
  app.use("/api/events", eventsRouter);
  app.use("/api/rooms", roomsRouter);
  app.use("/api", questionsRouter);
  app.use("/api", sessionsRouter);
  app.use("/api", speakersRouter);
};
