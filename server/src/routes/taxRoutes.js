const express = require('express');
const router = express.Router();
const { submitDeclaration, getMyDeclaration } = require('../controllers/taxController');
const { protect } = require('../middleware/authMiddleware');

router.route('/declaration')
    .post(protect, submitDeclaration)
    .get(protect, getMyDeclaration);

module.exports = router;
