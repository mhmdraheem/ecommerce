const express = require("express");
const router = express.Router();
const upload = require("../config/uploader");
const fs = require("fs");

router.get('/', (req, res) => {
    res.json(req.session.userData);
});

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (req.file) {
        req.session.userData.avatar = req.file.path.replace('public', '');
        res.json({ message: 'File uploaded successfully', filePath: req.session.userData.avatar });
    } else {
        return res.status(400).json({ message: 'No file uploaded' });
    }
});

router.post('/submit-info', (req, res) => {
    const { personalInfo, address, paymentMethod } = req.body;
    if(personalInfo) {
        req.session.userData.personalInfo = personalInfo;
    }
    if(address) {
        req.session.userData.address = address;
    }
    if(paymentMethod) {
        req.session.userData.paymentMethod = paymentMethod;
    }
    res.json({ message: 'Data received successfully' });
});

module.exports = router;