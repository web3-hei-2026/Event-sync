const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventsRouter = require('./routes/events');
const roomsRouter = require('./routes/rooms');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend running 🚀' });
});

// Routes Ny
app.use('/api/events', eventsRouter);
app.use('/api/rooms', roomsRouter);

// Routes collègues (décommenter quand ils pushent)
// app.use('/api/sessions', require('./routes/sessions'));   // Julia
// app.use('/api/speakers', require('./routes/speakers'));   // Sarobidy

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});