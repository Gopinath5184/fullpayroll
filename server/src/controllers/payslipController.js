const Payroll = require('../models/Payroll');

// @desc    Get Single Payslip
// @route   GET /api/payroll/payslip/:id
// @access  Private (Employee owns it or Admin)
const getPayslip = async (req, res) => {
    const payroll = await Payroll.findById(req.params.id)
        .populate('employee')
        .populate('organization');

    if (!payroll) {
        return res.status(404).json({ message: 'Payslip not found' });
    }

    // Role check
    if (req.user.role === 'Employee' && payroll.employee.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payroll);
};

// @desc    Get All Payslips for Logged in Employee
// @route   GET /api/payroll/employee/:userId
// @access  Private
const getEmployeePayslips = async (req, res) => {
    try {
        const Employee = require('../models/Employee');
        // 1. Find Employee by User ID
        const employee = await Employee.findOne({ user: req.params.userId });

        if (!employee) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }

        // 2. Find Payrolls by Employee ID
        const payrolls = await Payroll.find({ employee: employee._id })
            .sort({ year: -1, month: -1 });

        res.json(payrolls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getPayslip, getEmployeePayslips };
