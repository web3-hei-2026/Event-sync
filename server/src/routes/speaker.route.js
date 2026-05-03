const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const {
  createSpeaker,
  getAllSpeakers,
  getSpeakerById,
  getSpeakerSessions,
} = require("../controllers/speaker.controller");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");
const fs = require("fs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

router.post("/", upload.single("photo"), createSpeaker);
router.get("/", getAllSpeakers);
router.get("/:id", getSpeakerById);
router.get("/:id/sessions", getSpeakerSessions);

module.exports = router;
