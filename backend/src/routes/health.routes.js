const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is healthy"
  });
});

router.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .limit(5);

    if (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }

    res.json({
      status: "success",
      message: "Connected to Supabase",
      data
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

module.exports = router;