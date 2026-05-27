const axios = require("axios");
const FormData = require("form-data");

const AI_BASE_URL = process.env.AI_BASE_URL;

const predictCvFromPdf = async (file) => {
  if (!AI_BASE_URL) {
    throw new Error("AI_BASE_URL belum diatur di file .env");
  }

  const formData = new FormData();

  formData.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  formData.append("top_k", "5");

  const response = await axios.post(`${AI_BASE_URL}/predict`, formData, {
    headers: {
      ...formData.getHeaders(),
      "ngrok-skip-browser-warning": "true",
    },
    timeout: 60000,
  });

  return response.data;
};

module.exports = {
  predictCvFromPdf,
};