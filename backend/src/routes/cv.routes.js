const express = require("express");
const multer = require("multer");
const cvController = require("../controllers/cv.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfExt = file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdfMime || !isPdfExt) {
      return cb(new Error("File harus berformat PDF dan maksimal 2MB"));
    }

    cb(null, true);
  },
});

const handleCvUpload = (req, res, next) => {
  upload.single("cv_file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Ukuran file CV maksimal 2MB.",
          data: null,
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
        data: null,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File CV tidak valid.",
        data: null,
      });
    }

    next();
  });
};

router.post(
  "/cv/analyze",
  authenticateUser,
  handleCvUpload,
  cvController.analyzeCv
);

router.get("/cv/history", authenticateUser, cvController.getCvHistory);

router.delete(
  "/cv/history/:id",
  authenticateUser,
  cvController.deleteCvHistory
);

module.exports = router;