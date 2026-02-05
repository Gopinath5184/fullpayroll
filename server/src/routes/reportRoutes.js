const express = require('express');
const router = express.Router();
const { getPFReport, getESIReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/pf', protect, authorize('Super Admin', 'Payroll Admin', 'Finance'), getPFReport);
router.get('/esi', protect, authorize('Super Admin', 'Payroll Admin', 'Finance'), getESIReport);

module.exports = router;
