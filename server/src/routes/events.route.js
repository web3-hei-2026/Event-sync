const express = require('express');
const router = express.Router();

const { getEvents, getEventById, createEvent } = require('../controllers/events.controller');
const { getSessionsByEvent, getEventSessionSchedule } = require('../controllers/session.controller');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.get('/:id/sessions', getSessionsByEvent);
router.get('/:id/schedule', getEventSessionSchedule);

module.exports = router;