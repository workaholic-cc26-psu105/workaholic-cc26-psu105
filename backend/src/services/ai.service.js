const axios = require("axios");
const FormData = require("form-data");

const AI_BASE_URL = process.env.AI_BASE_URL;
const AI_PREDICT_ENDPOINT = process.env.AI_PREDICT_ENDPOINT || "/predict";

const predictCvFromPdf = async (file) => {
  if (!AI_BASE_URL) {
    throw new Error("AI_BASE_URL belum diatur di file .env");
  }

  if (!file) {
    throw new Error("File CV tidak ditemukan");
  }

  const formData = new FormData();

  formData.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  formData.append("top_k", "5");

  const response = await axios.post(
    `${AI_BASE_URL}${AI_PREDICT_ENDPOINT}`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000,
    }
  );

  return response.data;
};

module.exports = {
  predictCvFromPdf,
};