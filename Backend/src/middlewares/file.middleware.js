const multer = require("multer")

// to handle the file from the FE, multer: multipart file parser
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    }
})

module.exports = upload