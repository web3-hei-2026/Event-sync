const express = require('express');
const router = express.Router();
const { getRooms, getRoomSessions,createRoom } = require('../controllers/rooms.controller');

router.get('/', getRooms);
router.get('/:id/sessions', getRoomSessions);
router.post('/', createRoom);

module.exports = router;
