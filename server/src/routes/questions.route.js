const express = require('express');
const router = express.Router();
const { getQuestionsBySessionId, createQuestion, upvoteQuestion, unvoteQuestion } = require('../controllers/questions.controller');

router.get('/sessions/:id/questions', getQuestionsBySessionId);

router.post('/sessions/:id/questions', createQuestion);

router.post('/questions/:id/upvote', upvoteQuestion);

router.post('/questions/:id/unvote', unvoteQuestion);

module.exports = router;
