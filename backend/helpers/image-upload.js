const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'public/images/propertys');

    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + String(Math.floor(Math.random() * 100)) + path.extname(file.originalname));

    }
})

const imageUpload = multer({

    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Por favor, envie apenas png ou jpg!'));
        }
        cb(undefined, true);
    }

})

module.exports = { imageUpload };