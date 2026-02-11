import { useState } from 'react';
import { FaFilePdf, FaFileExcel, FaDownload, FaChartBar, FaTable } from 'react-icons/fa';
import api from '../utils/api';
import { convertToCSV, downloadFile } from '../utils/downloadHelper';
import { generatePDF } from '../utils/pdfGenerator'; // Reuse if possible or implement new

const Reports = () => {
    const [activeTab, setActiveTab] = useState('Payroll');
    const [downloading, setDownloading] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const handleDownload = async (reportName, format) => {
        setDownloading(true);
        try {
            let data;
            let filename = `${reportName.replace(/\s+/g, '_')}_${month}_${year}`;

            if (reportName === 'Monthly Payroll Register') {
                const response = await api.get(`/payroll?month=${month}&year=${year}`);
                data = response.data.map(p => ({
                    EmployeeID: p.employee.employeeId,
                    Name: p.employee.user?.name,
                    Department: p.employee.department,
                    Designation: p.employee.designation,
                    DaysPresent: p.presentDays,
                    GrossSalary: p.grossSalary,
                    TotalDeductions: p.totalDeductions,
                    NetSalary: p.netSalary,
                    Status: p.status
                }));
                if (format === 'PDF') {
                    alert("PDF download for full register not implemented yet. Downloading CSV.");
                    // generatePDF(...) - complex for a full table, keeping CSV for now
                }
                const csv = convertToCSV(data);
                downloadFile(csv, `${filename}.csv`);

            } else if (reportName === 'Bank Transfer Statement') {
                const response = await api.get(`/payroll?month=${month}&year=${year}`);
                data = response.data.map(p => ({
                    BeneficiaryName: p.employee.user?.name,
                    AccountNumber: p.employee.paymentDetails?.accountNumber || 'N/A',
                    IFSC: p.employee.paymentDetails?.ifscCode || 'N/A',
                    Amount: p.netSalary,
                    Narrative: `Salary ${month}/${year}`
                }));
                const csv = convertToCSV(data);
                downloadFile(csv, `${filename}.csv`);

            } else if (reportName === 'PF Electronic Challan (ECR)') {
                const response = await api.get(`/reports/pf?month=${month}&year=${year}`);
                data = response.data; // Already formatted by backend
                const csv = convertToCSV(data);
                downloadFile(csv, `${filename}.csv`);
            } else if (reportName === 'ESI Contribution Report') {
                const response = await api.get(`/reports/esi?month=${month}&year=${year}`);
                data = response.data;
                const csv = convertToCSV(data);
                downloadFile(csv, `${filename}.csv`);
            } else {
                alert(`Download for ${reportName} is under development.`);
            }

        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download report. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const reports = {
        Payroll: [
            { name: 'Monthly Payroll Register', date: 'Jan 2025', format: 'PDF/Excel' },
            { name: 'Bank Transfer Statement', date: 'Jan 2025', format: 'Excel' },
            { name: 'CTC Variance Report', date: 'Q1 2024-25', format: 'PDF' }
        ],
        Statutory: [
            { name: 'PF Electronic Challan (ECR)', date: 'Dec 2024', format: 'Text/Excel' },
            { name: 'ESI Contribution Report', date: 'Dec 2024', format: 'Excel' },
            { name: 'Professional Tax Summary', date: 'Dec 2024', format: 'PDF' }
        ],
        Tax: [
            { name: 'Form 16 Generation', date: 'FY 2023-24', format: 'Zip/PDF' },
            { name: 'TDS Challan Status', date: 'Monthly', format: 'PDF' },
            { name: 'Section 80C Summary', date: 'FY 2024-25', format: 'Excel' }
        ]
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
                    <p className="text-gray-500">Download and analyze your organization's financial data</p>
                    <div className="flex gap-4 mt-4">
                        <select value={month} onChange={e => setMonth(e.target.value)} className="border rounded p-2">
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select value={year} onChange={e => setYear(e.target.value)} className="border rounded p-2">
                            {['2024', '2025', '2026'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 hover:bg-blue-100 transition">
                        <FaChartBar /> Analytics View
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b border-gray-200">
                {Object.keys(reports).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab} Reports
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports[activeTab].map((report, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition">
                                <FaTable className="text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <span className="text-[10px] items-center px-2 py-1 rounded bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
                                {report.format}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{report.name}</h3>
                        <p className="text-xs text-gray-500 mb-6 font-mono bg-gray-50 inline-block px-2 py-1 rounded">Period: {new Date(0, month - 1).toLocaleString('default', { month: 'short' })} {year}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDownload(report.name, 'CSV')}
                                disabled={downloading}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                            >
                                <FaDownload className="text-xs" /> {downloading ? 'Please wait...' : 'Download'}
                            </button>
                            <button className="px-3 bg-gray-50 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">
                                <FaFilePdf />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Custom Reports</h2>
                    <p className="text-blue-200 text-sm max-w-lg mb-6">Need a specific report layout? Our custom report builder allows you to select fields and filters to match your local compliance requirements.</p>
                    <button className="bg-white text-blue-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-lg">
                        Launch Report Builder
                    </button>
                </div>
                {/* Background Decoration */}
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
                    <FaFileExcel size={240} />
                </div>
            </div>
        </div>
    );
};

export default Reports;
