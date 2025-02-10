const express = require("express");
const router = express.Router();
const upload = require("../config/uploader");
const fs = require("fs");

router.get('/', (req, res) => {
    const userId = req.session.userId;
    res.json({ avatar: getAvatar(userId) });
});

function getAvatar(userId) {
    const filePath = `public/img/profiles/${userId}`;
    if (fs.existsSync(filePath)) {
        return `profiles/${userId}/${fs.readdirSync(filePath)[0]}`  ;
    } else {
        return null;
    }
}

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