import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const Payslip = () => {
    const { id } = useParams();
    const [payslip, setPayslip] = useState(null);

    useEffect(() => {
        const fetchPayslip = async () => {
            try {
                const { data } = await api.get(`/payroll/payslip/${id}`);
                setPayslip(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPayslip();
    }, [id]);

    if (!payslip) return <div>Loading...</div>;

    const { employee, organization, month, year, earnings, deductions, grossSalary, totalDeductions, netSalary } = payslip;

    return (
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8" id="payslip">
                {/* Header */}
                <div className="text-center border-b pb-4 mb-4">
                    <h1 className="text-2xl font-bold uppercase">{organization.name}</h1>
                    <p className="text-gray-500">{organization.address || 'Company Address'}</p>
                    <h2 className="text-xl font-semibold mt-2">Payslip for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</h2>
                </div>

                {/* Employee Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                        <p><span className="font-bold">Employee Name:</span> {employee?.user?.name || 'N/A'}</p>
                        <p><span className="font-bold">Employee ID:</span> {employee.employeeId}</p>
                        <p><span className="font-bold">Designation:</span> {employee.designation}</p>
                        <p><span className="font-bold">Department:</span> {employee.department}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold">Date of Joining:</span> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                        <p><span className="font-bold">PAN:</span> {employee.paymentDetails?.panNumber || 'N/A'}</p>
                        <p><span className="font-bold">Bank Account:</span> {employee.paymentDetails?.accountNumber || 'N/A'}</p>
                        <p><span className="font-bold">Days Worked:</span> {payslip.presentDays} / {payslip.workingDays}</p>
                        <p><span className="font-bold">OT Hours:</span> {payslip.overtimeHours || 0}</p>
                    </div>
                </div>

                {/* Salary Details */}
                <div className="grid grid-cols-2 gap-8 border rounded-lg overflow-hidden mb-6">
                    {/* Earnings */}
                    <div>
                        <div className="bg-gray-100 p-2 font-bold text-center border-b">Earnings</div>
                        <div className="p-4">
                            {earnings.map((e, index) => (
                                <div key={index} className="flex justify-between py-1">
                                    <span>{e.name}</span>
                                    <span>₹{e.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-2 mt-2 border-t font-bold">
                                <span>Total Earnings</span>
                                <span>₹{grossSalary.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="border-l">
                        <div className="bg-gray-100 p-2 font-bold text-center border-b">Deductions</div>
                        <div className="p-4">
                            {deductions.map((d, index) => (
                                <div key={index} className="flex justify-between py-1">
                                    <span>{d.name}</span>
                                    <span>₹{d.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-2 mt-2 border-t font-bold">
                                <span>Total Deductions</span>
                                <span>₹{totalDeductions.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Pay */}
                <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-indigo-900">Net Payable</span>
                    <span className="text-2xl font-bold text-indigo-700">₹{netSalary.toLocaleString()}</span>
                </div>
                <div className="text-center text-sm text-gray-500">
                    <p>Amount in words: One Lakh ... only</p>
                    <p className="mt-4">This is a system generated payslip and does not require signature.</p>
                </div>
            </div>

            <div className="text-center mt-6">
                <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                    Download / Print
                </button>
            </div>
        </div>
    );
};

export default Payslip;
