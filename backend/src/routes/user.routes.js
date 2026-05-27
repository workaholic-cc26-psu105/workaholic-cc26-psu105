const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/user/profile", authenticateUser, userController.getUserProfile);
router.put("/user/profile", authenticateUser, userController.updateUserProfile);

module.exports = router;