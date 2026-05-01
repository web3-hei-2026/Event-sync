require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/speakers", require("./src/routes/speaker.routes"));

app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});