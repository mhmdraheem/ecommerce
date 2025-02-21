const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

router.get("/", (req, res) => {
  res.json(req.session.userData);
});

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  if (req.file) {
    const mimeType = req.file.mimetype;
    const base64Image = req.file.buffer.toString("base64");

    req.session.userData.avatar = {};
    req.session.userData.avatar.mimeType = mimeType;
    req.session.userData.avatar.base64Image = base64Image;

    res.json({
      message: "File uploaded successfully",
      avatar: req.session.userData.avatar,
    });
  } else {
    return res.status(400).json({ message: "No file uploaded" });
  }
});

router.post("/submit-info", (req, res) => {
  const { personalInfo, address, paymentMethod } = req.body;
  req.session.userData.profile = { personalInfo, address, paymentMethod };
  res.json({ message: "Data received successfully" });
});

module.exports = router;
