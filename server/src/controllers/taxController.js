const TaxDeclaration = require('../models/TaxDeclaration');
const Employee = require('../models/Employee');

// @desc    Submit Tax Declaration
// @route   POST /api/tax/declaration
// @access  Private (Employee)
const submitDeclaration = async (req, res) => {
    const { financialYear, section80C, section80D, hra } = req.body;

    // Find Employee ID
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    let declaration = await TaxDeclaration.findOne({
        employee: employee._id,
        financialYear
    });

    if (declaration) {
        declaration.section80C = section80C;
        declaration.section80D = section80D;
        declaration.hra = hra;
        declaration.status = 'Pending'; // Reset status on update
    } else {
        declaration = new TaxDeclaration({
            organization: req.user.organization,
            employee: employee._id,
            financialYear,
            section80C,
            section80D,
            hra
        });
    }

    await declaration.save();
    res.status(200).json(declaration);
};

// @desc    Get Declaration (Self)
// @route   GET /api/tax/declaration
// @access  Private
const getMyDeclaration = async (req, res) => {
    const { financialYear } = req.query;
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const declaration = await TaxDeclaration.findOne({
        employee: employee._id,
        financialYear
    });

    res.json(declaration || {});
};

module.exports = { submitDeclaration, getMyDeclaration };
