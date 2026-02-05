const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Organization = require('./src/models/Organization');
const Employee = require('./src/models/Employee');

dotenv.config();

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/payroll_db');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('Clearing Users...');
        await User.deleteMany();
        console.log('Clearing Organizations...');
        await Organization.deleteMany();
        console.log('Clearing Employees...');
        await Employee.deleteMany();

        console.log('Creating Organization...');
        // 1. Create Organization
        const org = await Organization.create({
            name: 'Acme Corp',
            email: 'admin@acme.com',
            phone: '1234567890',
            address: '123 Tech Park',
            website: 'https://acme.com'
        });

        console.log('Organization Created:', org.name);

        // 2. Create Users
        // 2. Create Users
        const password = 'password@123#';

        const users = [
            { name: 'Super Admin', email: 'superadmin@payroll.com', role: 'Super Admin' },
            { name: 'Payroll Admin', email: 'payroll@payroll.com', role: 'Payroll Admin' },
            { name: 'HR Admin', email: 'hr@payroll.com', role: 'HR Admin' },
            { name: 'John Employee', email: 'employee@payroll.com', role: 'Employee' },
            { name: 'Finance User', email: 'finance@payroll.com', role: 'Finance' }
        ];

        console.log('Creating Users...');
        const createdUsers = [];

        for (const u of users) {
            try {
                const user = await User.create({
                    name: u.name,
                    email: u.email,
                    password: password,
                    organization: org._id,
                    role: u.role
                });
                createdUsers.push(user);
            } catch (err) {
                console.error(`Failed to create user ${u.name}:`, err.message);
            }
        }

        console.log('Users Created');

        // 3. Create Employee Profile for the Employee User
        const empUser = createdUsers.find(u => u.role === 'Employee');
        if (empUser) {
            console.log('Creating Employee Profile for:', empUser.name);
            await Employee.create({
                user: empUser._id,
                organization: org._id,
                employeeId: 'EMP001',
                designation: 'Software Engineer',
                department: 'Engineering',
                dateOfJoining: new Date(),
                status: 'Active'
            });
            console.log('Employee Profile Created');
        }

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
