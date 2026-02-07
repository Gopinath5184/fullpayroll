const express = require('express');
const router = express.Router();
const {
    submitDeclaration,
    getMyDeclaration,
    getAllDeclarations,
    approveDeclaration
} = require('../controllers/taxController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/declaration')
    .post(protect, submitDeclaration)
    .get(protect, getMyDeclaration);

router.route('/all')
    .get(protect, authorize('HR Admin', 'Super Admin'), getAllDeclarations);

router.route('/approve/:id')
    .put(protect, authorize('HR Admin', 'Super Admin'), approveDeclaration);

module.exports = router;
