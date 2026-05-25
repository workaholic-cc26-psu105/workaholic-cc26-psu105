const savedJobsService = require("../services/savedJobs.service");

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await savedJobsService.getSavedJobs(req.user.id);

    res.json({
      success: true,
      data: savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const toggleSavedJob = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await savedJobsService.toggleSavedJob(req.user.id, id);

    res.json({
      success: true,
      saved: result.saved,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSavedJob = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await savedJobsService.deleteSavedJob(req.user.id, id);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  getSavedJobs,
  toggleSavedJob,
  deleteSavedJob,
};