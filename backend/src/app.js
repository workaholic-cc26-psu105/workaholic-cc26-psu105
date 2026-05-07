const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const jobsRoutes = require("./routes/jobs.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", jobsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Workaholic Backend API is running",
    data: null
  });
});

module.exports = app;