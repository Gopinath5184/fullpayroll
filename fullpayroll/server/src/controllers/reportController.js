const Payroll = require('../models/Payroll');

// @desc    Get PF Report Data
// @route   GET /api/reports/pf
// @access  Private (Admin)
const getPFReport = async (req, res) => {
    const { month, year } = req.query;

    // Find Approved Payrolls
    const payrolls = await Payroll.find({
        organization: req.user.organization,
        month,
        year,
        status: 'Approved'
    }).populate('employee');

    // Transform for CSV
    const reportData = payrolls.map(p => {
        const pfDeduction = p.deductions.find(d => d.name === 'Provident Fund')?.amount || 0;
        return {
            EmployeeId: p.employee.employeeId,
            Name: p.employee.user ? p.employee.user.name : '', // Populate user details in real scenario
            GrossWages: p.grossSalary,
            PF_Deduction: pfDeduction,
            Employer_Contribution: pfDeduction // Assumption for demo
        };
    });

    res.json(reportData);
};

// @desc    Get ESI Report Data
// @route   GET /api/reports/esi
// @access  Private (Admin)
const getESIReport = async (req, res) => {
    const { month, year } = req.query;
    // Similar logic to PF...
    res.json([{ message: 'ESI Report Placeholder' }]);
};

module.exports = { getPFReport, getESIReport };
