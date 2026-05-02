require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sessionRoutes = require("./src/routes/sessionRoutes"); // ← chemin correct

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", sessionRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "EventSync API is running" });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
