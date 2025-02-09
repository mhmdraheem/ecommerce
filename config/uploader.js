const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/profiles/');
    },
    filename: (req, file, cb) => {
        cb(null, path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

if (!fs.existsSync('public/img/profiles')) {
    fs.mkdirSync('public/img/profiles', { recursive: true });
}

module.exports = upload;