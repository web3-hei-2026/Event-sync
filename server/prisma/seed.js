const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Nettoyage rapide pour repartir à zéro (Optionnel mais conseillé pour la précision)
  await prisma.session.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.room.deleteMany({});

  // 1. Création de la salle
  const room = await prisma.room.create({
    data: { name: "Salle de Conférence" }
  })

  // 2. ÉVÈNEMENT 1 : HEI Tech Summit (3 Sessions)
  const event1 = await prisma.event.create({
    data: {
      title: "HEI Tech Summit 2026",
      startDate: new Date("2026-05-20T08:00:00Z"),
      endDate: new Date("2026-05-20T18:00:00Z"),
    },
  })

  await prisma.session.createMany({
    data: [
      { title: "Fullstack Intro", startTime: new Date("2026-05-20T09:00:00Z"), endTime: new Date("2026-05-20T10:30:00Z"), eventId: event1.id, roomId: room.id },
      { title: "Prisma Workshop", startTime: new Date("2026-05-20T11:00:00Z"), endTime: new Date("2026-05-20T12:30:00Z"), eventId: event1.id, roomId: room.id },
      { title: "AI Conference", startTime: new Date("2026-05-20T14:00:00Z"), endTime: new Date("2026-05-20T15:30:00Z"), eventId: event1.id, roomId: room.id },
    ]
  })

  // 3. ÉVÈNEMENT 2 : Design Workshop (2 Sessions)
  const event2 = await prisma.event.create({
    data: {
      title: "Design Workshop - Miora Julia",
      startDate: new Date("2026-06-15T10:00:00Z"),
      endDate: new Date("2026-06-15T16:00:00Z"),
    },
  })

  await prisma.session.createMany({
    data: [
      { title: "Color Theory (Gold & Beige)", startTime: new Date("2026-06-15T10:30:00Z"), endTime: new Date("2026-06-15T12:00:00Z"), eventId: event2.id, roomId: room.id },
      { title: "Steel Mentality Branding", startTime: new Date("2026-06-15T13:30:00Z"), endTime: new Date("2026-06-15T15:00:00Z"), eventId: event2.id, roomId: room.id },
    ]
  })

  console.log("✅ Données précises insérées : Event 1 (3 sessions) / Event 2 (2 sessions)");
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })