const router = require('express').Router();

const UserController = require('../controllers/UserController');
const PropertyController = require('../controllers/PropertyController');

/* middlewares */
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');
const Property = require('../models/Property');

router.post(
    '/create',
    verifyToken,
    imageUpload.array('images'),
    PropertyController.create
);
router.get('/', PropertyController.getAll);
router.get('/myproperties', verifyToken, PropertyController.getUserProperties);
router.get('/mynegotiations', verifyToken, PropertyController.getUserNegotiations);
router.get('/:id', PropertyController.getPropertyById);
router.delete('/:id', verifyToken, PropertyController.deleteProperty);
router.patch('/edit/:id', verifyToken, imageUpload.array('images'), PropertyController.editProperty);

module.exports = router;