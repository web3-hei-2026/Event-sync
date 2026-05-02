const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { verifyToken } = require("../middlewares/auth");

// Routes publiques (temporairement pour tests)
router.get("/events/:eventId/sessions", sessionController.getSessionsByEvent);
router.get("/sessions/:id", sessionController.getSessionById);
router.post("/sessions", sessionController.createSession);
router.put("/sessions/:id", sessionController.updateSession);
router.delete("/sessions/:id", sessionController.deleteSession);

module.exports = router;
