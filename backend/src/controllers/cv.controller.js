const cvService = require("../services/cv.service");

const analyzeCv = async (req, res) => {
  try {
    const result = await cvService.analyzeCv(req.file);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 422
          ? error.message
          : "Terjadi kesalahan pada server"
    });
  }
};

const getCvHistory = async (req, res) => {
  try {
    const history = await cvService.getCvHistory();

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
};

const deleteCvHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await cvService.deleteCvHistory(id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
};

module.exports = {
  analyzeCv,
  getCvHistory,
  deleteCvHistory
};