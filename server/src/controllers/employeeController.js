const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Create a new employee (and optionally a User account)
// @route   POST /api/employees
// @access  Private (HR/Admin)
const createEmployee = async (req, res) => {
    const {
        name, email, password, // For User creation
        employeeId, designation, department, dateOfJoining,
        personalDetails, paymentDetails
    } = req.body;

    try {
        // 1. Create User
        // Check if user exists first? Assuming clean create flow here.
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = await User.create({
            name,
            email,
            password: password || 'Welcome@123', // Default or generated password
            role: 'Employee',
            organization: req.user.organization
        });

        // 2. Create Employee Profile
        const employee = await Employee.create({
            user: user._id,
            organization: req.user.organization,
            employeeId,
            designation,
            department,
            dateOfJoining,
            personalDetails,
            paymentDetails
        });

        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all employees for the org
// @route   GET /api/employees
// @access  Private (HR/Admin)
const getEmployees = async (req, res) => {
    const employees = await Employee.find({ organization: req.user.organization })
        .populate('user', 'name email role');
    res.json(employees);
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
    const employee = await Employee.findById(req.params.id)
        .populate('user', 'name email role');

    if (employee && employee.organization.toString() === req.user.organization.toString()) {
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (HR/Admin)
const updateEmployee = async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (employee && employee.organization.toString() === req.user.organization.toString()) {
        const { designation, department, status, personalDetails, paymentDetails } = req.body;

        employee.designation = designation || employee.designation;
        employee.department = department || employee.department;
        employee.status = status || employee.status;
        employee.personalDetails = personalDetails || employee.personalDetails;
        employee.paymentDetails = paymentDetails || employee.paymentDetails;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
};

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee };
