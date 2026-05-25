const express = require("express");
const savedJobsController = require("../controllers/savedJobs.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/user/saved-jobs", authenticateUser, savedJobsController.getSavedJobs);
router.post("/user/saved-jobs/:id", authenticateUser, savedJobsController.toggleSavedJob);
router.delete("/user/saved-jobs/:id", authenticateUser, savedJobsController.deleteSavedJob);

module.exports = router;