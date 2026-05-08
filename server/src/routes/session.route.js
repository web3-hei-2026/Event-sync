const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session.controller");

router.get("/events/:eventId/sessions", sessionController.getSessionsByEvent);
router.get("/events/:id/schedule", sessionController.getEventSessionSchedule);

router.get("/:id", sessionController.getSessionById);
router.post("/", sessionController.createSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);

router.get("/test", (req, res) => {
  res.json({ ok: true, message: "sessions route working" });
});

module.exports = router;