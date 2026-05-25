const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat",
      data: result,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500 ? "Terjadi kesalahan pada server" : error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      token: result.token,
      data: result.user,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500 ? "Terjadi kesalahan pada server" : error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500 ? "Terjadi kesalahan pada server" : error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500 ? "Terjadi kesalahan pada server" : error.message,
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};