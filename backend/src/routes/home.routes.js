const express = require("express");
const homeController = require("../controllers/home.controller");

const router = express.Router();

router.get("/home/stats", homeController.getHomeStats);

module.exports = router;