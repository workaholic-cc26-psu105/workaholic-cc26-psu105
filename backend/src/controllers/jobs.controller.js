const jobsService = require("../services/jobs.service");

const getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      lokasi,
      kategori,
      tipe,
      page,
      per_page
    } = req.query;

    const result = await jobsService.getAllJobs({
      keyword,
      lokasi,
      kategori,
      tipe,
      page,
      per_page
    });

    res.json({
      success: true,
      data: result.jobs,
      meta: result.meta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await jobsService.getJobById(id);

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Lowongan tidak ditemukan"
    });
  }
};

const getJobCategories = async (req, res) => {
  try {
    const categories = await jobsService.getJobCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
};

const getJobLocations = async (req, res) => {
  try {
    const locations = await jobsService.getJobLocations();

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  getJobCategories,
  getJobLocations
};