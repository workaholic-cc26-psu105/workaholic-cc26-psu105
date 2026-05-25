const homeService = require("../services/home.service");

const getHomeStats = async (req, res) => {
  try {
    const stats = await homeService.getHomeStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
};

module.exports = {
  getHomeStats
};