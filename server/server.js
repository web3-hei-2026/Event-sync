
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eventsRouter = require('./routes/events');
const roomsRouter = require('./routes/rooms');
const sessionRoutes = require("./src/routes/sessionRoutes"); 


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Backend running' });
});


app.use('/api/events', eventsRouter);
app.use('/api/rooms', roomsRouter);
app.use("/api", sessionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "EventSync API is running" });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

