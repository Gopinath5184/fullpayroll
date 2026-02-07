const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryStructure = require('../models/SalaryStructure');
const Statutory = require('../models/Statutory');
const AuditLog = require('../models/AuditLog');

// Helper to calculate days in month
const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

// @desc    Initiate/Calculate Payroll for a month
// @route   POST /api/payroll/run
// @access  Private (Payroll Admin)
const runPayroll = async (req, res) => {
    const { month, year, employeeIds } = req.body;
    const organization = req.user.organization;

    try {
        // Fetch Organization Statutory Config
        const statutory = await Statutory.findOne({ organization });

        // Fetch Employees (All or specific list)
        let query = { organization, status: 'Active' };
        if (employeeIds && employeeIds.length > 0) {
            query._id = { $in: employeeIds };
        }
        const employees = await Employee.find(query);

        const payrollResults = [];

        for (const emp of employees) {
            // 1. Get Salary Structure
            // Ideally link structure to employee. For now fetching all structures and finding one (Mock logic)
            // or assuming default mock structure if not linked.
            // In real app: const structure = await SalaryStructure.findById(emp.salaryStructure);

            // Simplification: Fetch *any* structure for demo if not linked
            const structure = await SalaryStructure.findOne({ organization });

            if (!structure) {
                console.log(`No salary structure for ${emp.user.name}`);
                continue;
            }

            // 2. Access Attendance
            const totalDays = getDaysInMonth(month, year);
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const attendanceRecords = await Attendance.find({
                employee: emp._id,
                date: { $gte: startDate, $lte: endDate }
            });

            // Simple calculation: Count records present/leave/holiday
            // For demo: assume untracked days are present if Active, or strictly count records.
            // Let's rely on manual input or count present records.
            const presentCount = attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
            // Assume perfect attendance if no records for simplified demo? Or strict? 
            // Let's Auto-fill for demo purposes: 
            const paidDays = presentCount > 0 ? presentCount : totalDays;
            const lopDays = totalDays - paidDays;

            // 3. Calculate Components
            const earnings = [];
            let grossSalary = 0;

            for (const compRef of structure.components) {
                const comp = compRef.component; // populated
                if (!comp) continue; // Safety check - populate manually below if needed

                // Need to fetch component details if not populated in structure find above
                // In this loop structure is from findOne which IS NOT populated by default unless we used .populate()
                // Let's fix structure fetching to populate components.
            }
        }

        // Re-write simpler loop with proper population
        // Call helper function
        await generatePayrollBatch(employees, month, year, organization, statutory, res, req.user._id, req.ip);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payroll processing failed' });
    }
};

const generatePayrollBatch = async (employees, month, year, organization, statutory, res, userId, ip) => {
    const results = [];
    const totalDays = getDaysInMonth(month, year);

    // Optimize: Fetch all structures populated
    const structures = await SalaryStructure.find({ organization }).populate('components.component');

    for (const emp of employees) {
        // Use employee's linked structure or fallback to first one
        const structure = emp.salaryStructure
            ? structures.find(s => s._id.toString() === emp.salaryStructure.toString())
            : structures[0];

        if (!structure) {
            console.log(`No salary structure found for ${emp.employeeId}`);
            continue;
        }

        // Attendance Logic
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const attendanceRecords = await Attendance.find({
            employee: emp._id,
            date: { $gte: startDate, $lte: endDate }
        });

        // Calculate paid days: Total - LOP records
        const lopCount = attendanceRecords.filter(r => r.status === 'Absent' || r.status === 'Loss of Pay').length;
        const halfDayCount = attendanceRecords.filter(r => r.status === 'Half Day').length;

        // If no records, assume full month present for demo/safety, or handle as per config
        const paidDays = attendanceRecords.length > 0 ? (totalDays - lopCount - (halfDayCount * 0.5)) : totalDays;
        const lopDays = totalDays - paidDays;
        const payRatio = paidDays / totalDays;

        const processedEarnings = [];
        const processedDeductions = [];
        let gross = 0;

        // 1. Calculate Earnings (First pass for Basic used in percentages)
        let basicAmount = 0;

        // Identify Basic Component first
        const basicCompItem = structure.components.find(item => item.component?.name.toLowerCase().includes('basic'));
        if (basicCompItem) {
            const rawBasic = basicCompItem.value || basicCompItem.component.value;
            basicAmount = Math.round(rawBasic * payRatio);
        }

        // Process all components
        structure.components.forEach(item => {
            const comp = item.component;
            if (!comp) return;

            let amount = 0;
            const configValue = item.value || comp.value;

            if (item.calculationType === 'Flat Amount' || comp.calculationType === 'Flat Amount') {
                amount = configValue;
            } else if (item.calculationType === 'Percentage of Basic' || comp.calculationType === 'Percentage of Basic') {
                amount = (configValue / 100) * (basicCompItem ? (basicCompItem.value || basicCompItem.component.value) : 0);
            }

            // Apply LOP Pro-rata
            const payableAmount = Math.round(amount * payRatio);

            if (comp.type === 'Earning') {
                processedEarnings.push({ name: comp.name, amount: payableAmount });
                gross += payableAmount;
            } else {
                processedDeductions.push({ name: comp.name, amount: payableAmount });
            }
        });

        // 2. Statutory Deductions
        // PF Calculation (Typically on Basic or Gross up to limit)
        if (statutory?.pf?.enabled) {
            const pfWage = Math.min(basicAmount, statutory.pf.wageLimit || 15000);
            const pfAmount = Math.round(pfWage * (statutory.pf.employeeContribution / 100));
            if (pfAmount > 0) {
                processedDeductions.push({ name: 'Provident Fund', amount: pfAmount });
            }
        }

        // ESI Calculation (On Gross if Gross <= Limit)
        if (statutory?.esi?.enabled && gross <= (statutory.esi.wageLimit || 21000)) {
            const esiAmount = Math.round(gross * (statutory.esi.employeeContribution / 100));
            if (esiAmount > 0) {
                processedDeductions.push({ name: 'ESI', amount: esiAmount });
            }
        }

        // Professional Tax (Based on Slabs)
        if (statutory?.professionalTax?.enabled) {
            const slab = statutory.professionalTax.slabs.find(s => gross >= s.minSalary && gross <= s.maxSalary);
            if (slab && slab.taxAmount > 0) {
                processedDeductions.push({ name: 'Professional Tax', amount: slab.taxAmount });
            }
        }

        // Sum Deductions
        const totalDeductions = processedDeductions.reduce((sum, d) => sum + d.amount, 0);
        const netSalary = gross - totalDeductions;

        // Save/Update Payroll Record
        const payroll = await Payroll.findOneAndUpdate(
            { employee: emp._id, month, year },
            {
                organization,
                employee: emp._id,
                month,
                year,
                workingDays: totalDays,
                presentDays: paidDays,
                lopDays,
                earnings: processedEarnings,
                deductions: processedDeductions,
                grossSalary: gross,
                totalDeductions,
                netSalary,
                status: 'Draft'
            },
            { upsert: true, new: true }
        );
        results.push(payroll);
    }

    // Create Audit Log
    await AuditLog.create({
        user: userId,
        action: 'Processed Payroll',
        details: `Processed payroll for ${month}/${year} - ${results.length} employees`,
        ip: ip
    });

    res.json({ message: 'Payroll processed successfully', count: results.length, data: results });
};

// @desc    Get Payroll Records
// @route   GET /api/payroll
// @access  Private
const getPayroll = async (req, res) => {
    const { month, year } = req.query;
    const payrolls = await Payroll.find({ organization: req.user.organization, month, year })
        .populate('employee'); // Populate employee name
    res.json(payrolls);
};

// @desc    Approve/Finalize Payroll
// @route   PUT /api/payroll/approve
// @access  Private
const approvePayroll = async (req, res) => {
    const { month, year } = req.body;
    await Payroll.updateMany(
        { organization: req.user.organization, month, year },
        { status: 'Approved' }
    );
    res.json({ message: 'Payroll approved for period' });
};

module.exports = { runPayroll, getPayroll, approvePayroll };
