const avatarService = require("../services/avatar.service");

const uploadAvatar = async (req, res) => {
  try {
    const result = await avatarService.uploadAvatar(req.user.id, req.file);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 422
          ? error.message
          : error.message || "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  uploadAvatar,
};