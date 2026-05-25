const express = require("express");
const savedJobsController = require("../controllers/savedJobs.controller");

const router = express.Router();

router.get("/user/saved-jobs", savedJobsController.getSavedJobs);
router.post("/user/saved-jobs/:id", savedJobsController.toggleSavedJob);
router.delete("/user/saved-jobs/:id", savedJobsController.deleteSavedJob);

module.exports = router;