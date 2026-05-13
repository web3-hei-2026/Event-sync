const express = require('express');
const router = express.Router();
const { getQuestionsBySessionId, createQuestion, upvoteQuestion, unvoteQuestion } = require('../controllers/questions.controller');

router.post('/:id/upvote', upvoteQuestion);
router.post('/:id/unvote', unvoteQuestion);

module.exports = router;
