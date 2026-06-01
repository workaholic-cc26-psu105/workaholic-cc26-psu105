const userService = require("../services/user.service");

const getUserProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.user);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = await userService.updateUserProfile(
      req.user,
      req.body
    );

    res.json({
      success: true,
      message: "Profile berhasil diperbarui",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};