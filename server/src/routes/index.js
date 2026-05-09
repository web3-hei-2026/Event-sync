const express = require("express");
const router = express.Router();

router.use("/events", require("./events.route"));
router.use("/rooms", require("./rooms.route"));
router.use("/sessions", require("./session.route"));
router.use("/speakers", require("./speaker.route"));
router.use("/questions", require("./questions.route"));

module.exports = router;