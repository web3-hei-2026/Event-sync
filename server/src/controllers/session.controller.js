const prisma = require("../lib/prisma");


// Récupérer toutes les sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        room: true,    // Pour voir le nom de la salle
        event: true    // Pour voir à quel événement c'est lié
      }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// =========================
// GET /events/:eventId/sessions
// =========================
const getSessionsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const now = new Date();

    const sessions = await prisma.session.findMany({
      where: { eventId },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    const formatted = sessions.map((s) => ({
      ...s,
      isLive: now >= s.startTime && now <= s.endTime,
      speakers: s.speakers.map((ss) => ss.speaker),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// =========================
// GET /sessions/:id
// =========================
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        event: true,
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
        questions: {
          orderBy: { upvotes: "desc" },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      ...session,
      isLive: now >= session.startTime && now <= session.endTime,
      speakers: session.speakers.map((ss) => ss.speaker),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// =========================
// POST /sessions
// =========================
const createSession = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      capacity,
      eventId,
      roomId,
      speakerIds,
    } = req.body;

    // Validation
    if (!title || !startTime || !endTime || !eventId || !roomId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const session = await prisma.session.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        capacity: capacity ?? null,
        eventId,
        roomId,

        // pivot relation (SessionSpeaker)
        speakers: speakerIds?.length
          ? {
              create: speakerIds.map((id) => ({
                speaker: {
                  connect: { id },
                },
              })),
            }
          : undefined,
      },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
    });

    res.status(201).json({
      ...session,
      speakers: session.speakers.map((ss) => ss.speaker),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// =========================
// PUT /sessions/:id
// =========================
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startTime,
      endTime,
      capacity,
      roomId,
      speakerIds,
    } = req.body;

    const session = await prisma.session.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        capacity,
        roomId,

        // reset + recreate relations proprement
        speakers: speakerIds?.length
          ? {
              deleteMany: {},
              create: speakerIds.map((id) => ({
                speaker: {
                  connect: { id },
                },
              })),
            }
          : undefined,
      },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
    });

    res.json({
      ...session,
      speakers: session.speakers.map((ss) => ss.speaker),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// =========================
// DELETE /sessions/:id
// =========================
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// =========================
// GET /events/:id/schedule
// =========================
const getEventSessionSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();

    const sessions = await prisma.session.findMany({
      where: { eventId: id },
      include: {
        event: true,
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
        questions: {
          orderBy: { upvotes: "desc" },
        },
      },
    });

    if (!sessions.length) {
      return res.status(404).json({ error: "No sessions found for this event" });
    }

    const formatted = sessions.map((s) => ({
      ...s,
      isLive: now >= s.startTime && now <= s.endTime,
      speakers: s.speakers.map((ss) => ss.speaker),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// =========================
// EXPORT
// =========================
module.exports = {
  getAllSessions,
  getSessionsByEvent,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getEventSessionSchedule,
};