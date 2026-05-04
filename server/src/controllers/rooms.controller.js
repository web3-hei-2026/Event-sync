const prisma = require('../lib/prisma');

const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRoomSessions = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const now = new Date();
    const sessions = await prisma.session.findMany({
      where: { roomId: id },
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
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      title: s.title,
      startTime: s.startTime,
      endTime: s.endTime,
      isLive: now >= s.startTime && now <= s.endTime,
      room: s.room,
      speakers: s.speakers.map((ss) => ss.speaker),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRooms,
  getRoomSessions,
};
