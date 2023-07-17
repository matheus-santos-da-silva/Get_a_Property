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
router.get('/', PropertyController.getAll);
router.get('/mypropertys', verifyToken, PropertyController.getUserPropertys);

module.exports = router;