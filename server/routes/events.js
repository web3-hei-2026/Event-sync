const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET /api/events
router.get('/', async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
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
            room: { select: { id: true, name: true } },
            speakers: {
              select: {
                speaker: {
                  select: { id: true, fullName: true, photoUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Resource not found' });
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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;