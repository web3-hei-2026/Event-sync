const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET /api/rooms
router.get('/', async (req, res) => {
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
});

module.exports = router;