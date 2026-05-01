const prisma = require("../lib/prisma");

exports.getAllSpeakers = async () => {
  return await prisma.speaker.findMany({
    orderBy: { createdAt: "desc" }
  });
};
exports.getSpeakerById = async (id) => {
  return await prisma.speaker.findUnique({
    where: { id: Number(id) } // IMPORTANT
  });
};
// exports.getSpeakerById = async (id) => {
//   return await prisma.speaker.findUnique({
//     where: { id },
//     include: {
//       sessions: {
//         include: {
//           session: true
//         }
//       }
//     }
//   });
// };

exports.getSpeakerSessions = async (id) => {
  const data = await prisma.sessionSpeaker.findMany({
    where: { speakerId: id },
    include: {
      session: {
        include: {
          room: true,
          event: true
        }
      }
    }
  });

  return data.map(item => item.session);
};