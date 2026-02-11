import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EmployeeForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: 'Welcome@123',
        employeeId: '', designation: '', department: '', dateOfJoining: '',
        personalDetails: { dob: '', gender: 'Male', address: '', phone: '' },
        paymentDetails: { bankName: '', accountNumber: '', ifscCode: '', panNumber: '', uanNumber: '', esiNumber: '' }
    });
    const [message, setMessage] = useState('');

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employees', formData);
            navigate('/employees');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create employee');
        }
    };

    return (
        <div className="container px-4 py-6 mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Add New Employee</h1>
            {message && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
                {/* Account Info */}
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={e => handleChange(e)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" required />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Email (Username)</label>
                            <input type="email" name="email" value={formData.email} onChange={e => handleChange(e)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" required />
                        </div>
                    </div>
                </div>

                {/* Professional Info */}
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Professional Details</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                            <input type="text" name="employeeId" value={formData.employeeId} onChange={e => handleChange(e)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <input type="text" name="department" value={formData.department} onChange={e => handleChange(e)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                            <input type="text" name="designation" value={formData.designation} onChange={e => handleChange(e)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                            <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={e => handleChange(e)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" required />
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="text" name="phone" value={formData.personalDetails.phone} onChange={e => handleChange(e, 'personalDetails')} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" />
                        </div>
                        <div className="sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" name="address" value={formData.personalDetails.address} onChange={e => handleChange(e, 'personalDetails')} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" />
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Payment & Tax Details</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                            <input type="text" name="panNumber" value={formData.paymentDetails.panNumber} onChange={e => handleChange(e, 'paymentDetails')} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input type="text" name="bankName" value={formData.paymentDetails.bankName} onChange={e => handleChange(e, 'paymentDetails')} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                            <input type="text" name="accountNumber" value={formData.paymentDetails.accountNumber} onChange={e => handleChange(e, 'paymentDetails')} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                            <input type="text" name="ifscCode" value={formData.paymentDetails.ifscCode} onChange={e => handleChange(e, 'paymentDetails')} className="w-full mt-1 border-gray-300 rounded-md shadow-sm border p-2" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Create Employee
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
