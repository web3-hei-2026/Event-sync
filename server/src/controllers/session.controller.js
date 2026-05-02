const prisma = require('../lib/prisma')

// GET /events/:eventId/sessions
const getSessionsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    const now = new Date()
    
    const sessions = await prisma.session.findMany({
      where: { eventId },
      include: {
        room: true,
        speakers: true
      },
      orderBy: { startTime: 'asc' }
    })
    
    const sessionsWithLive = sessions.map(session => ({
      ...session,
      isLive: now >= session.startTime && now <= session.endTime
    }))
    
    res.json(sessionsWithLive)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /sessions/:id
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params
    const now = new Date()
    
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        event: true,
        room: true,
        speakers: true,
        questions: {
          orderBy: { upvotes: 'desc' }
        }
      }
    })
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    const sessionWithLive = {
      ...session,
      isLive: now >= session.startTime && now <= session.endTime
    }
    
    res.json(sessionWithLive)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /sessions
const createSession = async (req, res) => {
  try {
    const { title, description, startTime, endTime, capacity,  eventId, roomId, speakerIds } = req.body
    
    const session = await prisma.session.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: capacity || 0,
        eventId,
        roomId,
        speakers: {
          connect: speakerIds?.map(id => ({ id })) || []
        }
      },
      include: {
        room: true,
        speakers: true
      }
    })
    
    res.status(201).json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /sessions/:id
const updateSession = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, startTime, endTime, capacity, roomId, speakerIds } = req.body
    
    const session = await prisma.session.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        capacity,
        roomId,
        speakers: {
          set: speakerIds?.map(id => ({ id })) || []
        }
      },
      include: {
        room: true,
        speakers: true
      }
    })
    
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE /sessions/:id
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.session.delete({
      where: { id }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get event/:id/schedule
const getEventSessionSchedule = async(req, res) => {
  try {
  const { id } = req.params
  const now = new Date()

  const sessions = await prisma.session.findMany({
    where: { eventId: id },
    include: {
      event: true,
      room: true,
      speakers: {
        include: {
          speaker: true
        }
      },
      questions: {
        orderBy: { upvotes: 'desc' }
      }
    }
  })

  if (sessions.length === 0) {
    return res.status(404).json({ error: 'No sessions found for this event' })
  }

  const result = sessions.map(session => ({
    ...session,
    isLive: now >= session.startTime && now <= session.endTime
  }))

  res.json(result)

} catch (error) {
  res.status(500).json({ error: error.message })
}
}

module.exports = {
  getSessionsByEvent,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getEventSessionSchedule
}