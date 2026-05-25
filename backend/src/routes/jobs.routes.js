const express = require("express");
const jobsController = require("../controllers/jobs.controller");

const router = express.Router();

router.get("/jobs", jobsController.getAllJobs);
router.get("/jobs/categories", jobsController.getJobCategories);
router.get("/jobs/locations", jobsController.getJobLocations);
router.get("/jobs/:id", jobsController.getJobById);

module.exports = router;