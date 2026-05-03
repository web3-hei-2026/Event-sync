const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventsRouter = require('./routes/events');
const roomsRouter = require('./routes/rooms');
const sessionRoutes = require("./src/routes/sessionRoutes");
const speakerRoutes = require("./src/routes/speaker.routes");
const questionRoutes = require("./src/routes/question.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/speakers", speakerRoutes);
app.use("/api/events", eventsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'EventSync API is fully integrated and running 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});