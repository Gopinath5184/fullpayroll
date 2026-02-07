const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Mark attendance (Check-in/Check-out or Manual)
// @route   POST /api/attendance
// @access  Private (Employee/Admin)
const markAttendance = async (req, res) => {
    const { employeeId, date, status, checkIn, checkOut } = req.body;

    // If not admin, force employeeId to be self
    // Logic to find employee from user
    let targetEmployeeId = employeeId;
    if (req.user.role === 'Employee') {
        const emp = await Employee.findOne({ user: req.user._id });
        if (!emp) return res.status(404).json({ message: 'Employee profile not found' });
        targetEmployeeId = emp._id;
    }

    // Upsert attendance for the date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
        employee: targetEmployeeId,
        date: attendanceDate
    });

    if (attendance) {
        attendance.status = status || attendance.status;
        attendance.checkIn = checkIn || attendance.checkIn;
        attendance.checkOut = checkOut || attendance.checkOut;
        // Recalculate work hours logic here if checkin/out provided
    } else {
        attendance = new Attendance({
            employee: targetEmployeeId,
            organization: req.user.organization,
            date: attendanceDate,
            status,
            checkIn,
            checkOut
        });
    }

    await attendance.save();
    res.status(200).json(attendance);
};

// @desc    Get attendance for employee/month
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    const { employeeId, month, year } = req.query;

    if (!req.user) return res.status(401).json({ message: 'User not found' });
    let query = { organization: req.user.organization };

    if (employeeId) query.employee = employeeId;

    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month
        query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).populate('employee', 'employeeId');
    res.json(records);
};

module.exports = { markAttendance, getAttendance };
