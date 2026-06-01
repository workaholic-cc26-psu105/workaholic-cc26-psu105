const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const jobsRoutes = require("./routes/jobs.routes");
const savedJobsRoutes = require("./routes/savedJobs.routes");
const cvRoutes = require("./routes/cv.routes");
const homeRoutes = require("./routes/home.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const avatarRoutes = require("./routes/avatar.routes");

const app = express();

app.use(cors());

// FIX: supaya request profile/avatar base64 tidak ditolak karena ukuran body terlalu kecil
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", jobsRoutes);
app.use("/api", savedJobsRoutes);
app.use("/api", cvRoutes);
app.use("/api", homeRoutes);
app.use("/api", avatarRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Workaholic Backend API is running",
    data: null,
  });
});

module.exports = app;