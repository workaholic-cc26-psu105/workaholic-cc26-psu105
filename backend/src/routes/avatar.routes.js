const express = require("express");
const multer = require("multer");
const avatarController = require("../controllers/avatar.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File harus berupa JPG, PNG, atau WEBP maksimal 2MB"));
    }

    cb(null, true);
  },
});

router.post(
  "/user/avatar",
  authenticateUser,
  upload.single("avatar"),
  avatarController.uploadAvatar
);

module.exports = router;