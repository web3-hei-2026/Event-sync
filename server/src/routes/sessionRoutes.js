const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Routes publiques (GET uniquement)
router.get("/events/:eventId/sessions", sessionController.getSessionsByEvent);
router.get("/events/:id/schedule", sessionController.getEventSessionSchedule);
router.get("/sessions/:id", sessionController.getSessionById);

module.exports = router;