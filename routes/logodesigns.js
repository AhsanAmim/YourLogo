const express = require('express');
const router = express.Router();
const logodesigns = require('../controllers/logodesigns');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateLogodesign } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Logodesign = require('../models/logodesign');

router.route('/')
    .get(catchAsync(logodesigns.index))
    .post(isLoggedIn, upload.array('image'), validateLogodesign, catchAsync(logodesigns.createLogodesign))


router.get('/new', isLoggedIn, logodesigns.renderNewForm)

router.route('/:id')
    .get(catchAsync(logodesigns.showLogodesign))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateLogodesign, catchAsync(logodesigns.updateLogodesign))
    .delete(isLoggedIn, isAuthor, catchAsync(logodesigns.deleteLogodesign));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(logodesigns.renderEditForm))



module.exports = router;