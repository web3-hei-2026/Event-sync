const express = require('express');
const router = express.Router();
const { getRooms, getRoomSessions } = require('../controllers/rooms.controller');

router.get('/', getRooms);
router.get('/:id/sessions', getRoomSessions);

module.exports = router;
