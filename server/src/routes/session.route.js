const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session.controller");
const questionsController = require("../controllers/questions.controller");

router.get("/:id", sessionController.getSessionById);
router.post("/", sessionController.createSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);

// Questions for a session
router.get("/:id/questions", questionsController.getQuestionsBySessionId);
router.post("/:id/questions", questionsController.createQuestion);

router.get("/test", (req, res) => {
  res.json({ ok: true, message: "sessions route working" });
});

module.exports = router;