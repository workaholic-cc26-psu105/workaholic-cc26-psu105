const express = require("express");
const homeController = require("../controllers/home.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/home/stats", authenticateUser, homeController.getHomeStats);

module.exports = router;