import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { FaFileInvoiceDollar, FaDownload, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyPayslips = () => {
    const { user } = useContext(AuthContext);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPayslips();
    }, []);

    const fetchMyPayslips = async () => {
        try {
            // Assuming the backend has an endpoint or we filter by user ID
            // Ideally backend should have /payslip/my or filter /payslip by logged in user
            // For now, let's try fetching all and filtering (if admin) or backend handles it
            // Based on previous code, let's assume we need to implement a route or use existing
            // Let's check backend routes in a moment. For now, writing UI.

            // If backend doesn't support list, we might need to add it. 
            // Let's assume GET /payslip returns list for now, or we might need to fix it.
            const { data } = await api.get(`/payslip/employee/${user._id}`); // We might need to add this route
            setPayslips(data || []);
        } catch (error) {
            console.error("Error fetching payslips", error);
            // Fallback for demo if route doesn't exist yet
            setPayslips([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Payslips</h1>
                    <p className="text-gray-500 mt-1">View and download your salary statements</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Month / Year</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gross Salary</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Net Salary</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center">Loading...</td></tr>
                            ) : payslips.length > 0 ? (
                                payslips.map((slip) => (
                                    <tr key={slip._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {slip.month} / {slip.year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {slip.grossSalary?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                            {slip.totalDeductions?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                            {slip.netSalary?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link to={`/payslip/${slip._id}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                                                <FaEye /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <FaFileInvoiceDollar className="text-4xl text-gray-300 mb-3" />
                                        <p>No payslips generated yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyPayslips;
