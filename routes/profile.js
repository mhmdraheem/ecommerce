const express = require("express");
const router = express.Router();
const upload = require("../config/uploader");

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filePath: req.file.path });
});


router.post('/submit-info', (req, res) => {
    const { personalInfo, address, paymentMethod } = req.body;
    console.log('Received data:', { personalInfo, address, paymentMethod });
    res.json({ message: 'Data received successfully' });
});

module.exports = router;