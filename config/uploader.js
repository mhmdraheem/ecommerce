const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = `public/img/profiles/${req.session.userId}`;
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        } else {
            fs.readdirSync(filePath).forEach(f => fs.rmSync(`${filePath}/${f}`));
        }

        cb(null, filePath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
  
const upload = multer({ storage });

module.exports = upload;