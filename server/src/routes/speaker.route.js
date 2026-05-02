const express = require("express");
const router = express.Router();

const multer = require("multer");
const { createSpeaker, getAllSpeakers, getSpeakerById, getSpeakerSessions } = require("../controllers/speaker.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), createSpeaker);

router.get("/", getAllSpeakers);
router.get("/:id", getSpeakerById);
router.get("/:id/sessions", getSpeakerSessions);

module.exports = router;