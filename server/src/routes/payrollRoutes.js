const express = require('express');
const router = express.Router();
const { runPayroll, getPayroll, approvePayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/run')
    .post(protect, authorize('Super Admin', 'Payroll Admin'), runPayroll);

router.route('/approve')
    .put(protect, authorize('Super Admin', 'Payroll Admin'), approvePayroll);

router.route('/')
    .get(protect, getPayroll);

const { getPayslip, getEmployeePayslips } = require('../controllers/payslipController');
router.route('/payslip/:id').get(protect, getPayslip);
router.route('/employee/:userId').get(protect, getEmployeePayslips);

module.exports = router;
