const router = require('express').Router();

const UserController = require('../controllers/UserController');
const PropertyController = require('../controllers/PropertyController');

/* middlewares */
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

router.post(
    '/create',
    verifyToken,
    imageUpload.array('images'),
    PropertyController.create
);

module.exports = router;