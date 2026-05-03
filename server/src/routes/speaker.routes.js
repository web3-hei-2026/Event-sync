<<<<<<< HEAD
=======
// const express = require("express");
// const router = express.Router();

// const speakerController = require("../controllers/speaker.controller");
// const upload = require("../lib/upload");

// // routes
// router.get("/", speakerController.getAllSpeakers);
// router.get("/:id", speakerController.getSpeakerById);
// router.get("/:id/sessions", speakerController.getSpeakerSessions);

// // create speaker avec image
// router.post("/", upload.single("photo"), speakerController.createSpeaker);

// module.exports = router;

>>>>>>> c71733c6665d0f76f89771f49b27e3c1e2b4a4f0
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

<<<<<<< HEAD
=======
// IMPORTANT: "photo" doit matcher Postman
>>>>>>> c71733c6665d0f76f89771f49b27e3c1e2b4a4f0
router.post("/", upload.single("photo"), createSpeaker);

router.get("/", getAllSpeakers);
router.get("/:id", getSpeakerById);
router.get("/:id/sessions", getSpeakerSessions);

module.exports = router;
