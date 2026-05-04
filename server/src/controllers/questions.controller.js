const prisma = require('../lib/prisma');

const isSessionLive = (session) => {
  const now = new Date();
  return now >= new Date(session.startTime) && now <= new Date(session.endTime);
};


const getQuestionsBySessionId = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    const questions = await prisma.question.findMany({
      where: { sessionId },
      orderBy: { upvotes: 'desc' }
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createQuestion = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { content, authorName } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Le contenu de la question est obligatoire' });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    if (!isSessionLive(session)) {
      return res.status(403).json({ error: 'Impossible de soumettre une question : la session n\'est pas en cours' });
    }

    const question = await prisma.question.create({
      data: {
        content: content.trim(),
        authorName: authorName || null,
        sessionId
      }
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId est obligatoire pour voter' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { session: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question introuvable' });
    }

    if (!isSessionLive(question.session)) {
      return res.status(403).json({ error: 'Impossible de voter : la session n\'est pas en cours' });
    }

    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId
        }
      }
    });

    if (existingUpvote) {
      return res.status(400).json({ error: 'Vous avez déjà voté pour cette question' });
    }

    const [upvote, updatedQuestion] = await prisma.$transaction([
      prisma.upvote.create({
        data: { questionId, userId }
      }),
      prisma.question.update({
        where: { id: questionId },
        data: { upvotes: { increment: 1 } }
      })
    ]);

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId est obligatoire pour retirer un vote' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { session: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question introuvable' });
    }

    if (!isSessionLive(question.session)) {
      return res.status(403).json({ error: 'Impossible de voter : la session n\'est pas en cours' });
    }

    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId
        }
      }
    });

    if (!existingUpvote) {
      return res.status(400).json({ error: 'Vous n\'avez pas encore voté pour cette question' });
    }

    const [deletedUpvote, updatedQuestion] = await prisma.$transaction([
      prisma.upvote.delete({
        where: {
          questionId_userId: {
            questionId,
            userId
          }
        }
      }),
      prisma.question.update({
        where: { id: questionId },
        data: { upvotes: { decrement: 1 } }
      })
    ]);

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getQuestionsBySessionId, createQuestion, upvoteQuestion, unvoteQuestion };
