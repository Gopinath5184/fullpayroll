const express = require('express');
const router = express.Router();
const { runPayroll, getPayroll, approvePayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/run')
    .post(protect, authorize('HR Admin'), runPayroll);

router.route('/approve')
    .put(protect, authorize('HR Admin'), approvePayroll);

router.route('/')
    .get(protect, authorize('HR Admin', 'Super Admin', 'Finance'), getPayroll);

const { getPayslip, getEmployeePayslips } = require('../controllers/payslipController');
router.route('/payslip/:id').get(protect, getPayslip);
router.route('/employee/:userId').get(protect, getEmployeePayslips);

module.exports = router;
