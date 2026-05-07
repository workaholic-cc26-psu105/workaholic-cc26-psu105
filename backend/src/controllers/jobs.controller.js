const jobsService = require("../services/jobs.service");

const getAllJobs = async (req, res) => {
  try {
    const { keyword, category, location } = req.query;

    const jobs = await jobsService.getAllJobs({
      keyword,
      category,
      location
    });

    res.json({
      success: true,
      message: "Data lowongan berhasil diambil",
      data: {
        jobs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await jobsService.getJobById(id);

    res.json({
      success: true,
      message: "Detail lowongan berhasil diambil",
      data: {
        job
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Lowongan tidak ditemukan",
      data: null
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById
};