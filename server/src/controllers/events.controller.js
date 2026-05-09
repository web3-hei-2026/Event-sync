const prisma = require('../lib/prisma');

/**
 * GET ALL EVENTS
 */
const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
      },
    });

    res.json(events);
  } catch (error) {
    console.error("getEvents error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET EVENT BY ID
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
        sessions: {
          orderBy: { startTime: 'asc' },
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            room: {
              select: {
                id: true,
                name: true,
              },
            },
            speakers: {
              select: {
                speaker: {
                  select: {
                    id: true,
                    fullName: true,
                    photoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const now = new Date();

    const formatted = {
      ...event,
      sessions: event.sessions.map((s) => ({
        id: s.id,
        title: s.title,
        startTime: s.startTime,
        endTime: s.endTime,
        isLive: now >= s.startTime && now <= s.endTime,
        room: s.room,
        speakers: s.speakers.map((ss) => ss.speaker),
      })),
    };

    res.json(formatted);
  } catch (error) {
    console.error("getEventById error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location } = req.body;

    // validation simple
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("createEvent error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
};