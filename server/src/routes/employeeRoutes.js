const express = require('express');
const router = express.Router();
const { createEmployee, getEmployees, getEmployeeById, updateEmployee } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Super Admin', 'Payroll Admin', 'HR Admin'), createEmployee)
    .get(protect, authorize('Super Admin', 'Payroll Admin', 'HR Admin', 'Finance'), getEmployees);

router.route('/:id')
    .get(protect, getEmployeeById) // Employees can view their own potentially, strict check needed in controller or middleware if desired.
    .put(protect, authorize('Super Admin', 'Payroll Admin', 'HR Admin'), updateEmployee);

module.exports = router;
