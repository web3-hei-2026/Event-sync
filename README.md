# EventSync

A real-time event management platform that replaces static programs with a dynamic interface to navigate events and interact with live sessions.

---

## Team

| Name | Role |
|------|------|
| Ny Anja | Events & Rooms |
| Julia | Sessions & Schedule |
| Sarobidy | Speakers |
| Jessica | Questions & Upvotes |

---

## Stack

- **Frontend** — Next.js, Tailwind CSS, TypeScript
- **Backend** — Node.js, Express.js
- **Database** — PostgreSQL, Prisma ORM

---

## Getting Started

### Clone

```bash
git clone https://github.com/web3-hei-2026/Event-sync.git
cd Event-sync
```

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/eventsync"
```

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
# Running on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
```

Create a `.env.local` file in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# Running on http://localhost:3000
```