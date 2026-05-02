const prisma = require("../lib/prisma");
const speakerService = require("../services/speaker.service");

exports.getAllSpeakers = async (req, res) => {
  try {
    const speakers = await speakerService.getAllSpeakers();
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSpeakerById = async (req, res) => {
  try {
    const { id } = req.params;

    const speaker = await prisma.speaker.findUnique({
      where: { id },
    });

    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }

    res.json(speaker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSpeakerSessions = async (req, res) => {
  try {
    const sessions = await speakerService.getSpeakerSessions(req.params.id);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSpeaker = async (req, res) => {
  try {
    const { fullName, biography, externalLinks } = req.body;

const photoUrl = req.file
  ? `/uploads/${req.file.filename}`
  : null;

const speaker = await prisma.speaker.create({
  data: {
    fullName,
    biography,
    externalLinks,
    photoUrl,
  },
});

    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};