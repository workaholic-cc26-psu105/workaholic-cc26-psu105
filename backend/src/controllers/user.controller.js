const userService = require("../services/user.service");

const getUserProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.user.id);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = await userService.updateUserProfile(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Profile berhasil diperbarui",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};