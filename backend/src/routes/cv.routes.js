const express = require("express");
const multer = require("multer");
const cvController = require("../controllers/cv.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("File harus berformat PDF dan maksimal 2MB"));
    }

    cb(null, true);
  },
});

router.post(
  "/cv/analyze",
  authenticateUser,
  upload.single("cv_file"),
  cvController.analyzeCv
);

router.get("/cv/history", authenticateUser, cvController.getCvHistory);

router.delete(
  "/cv/history/:id",
  authenticateUser,
  cvController.deleteCvHistory
);

module.exports = router;