import { useState } from 'react';
import {
  FaFilePdf,
  FaFileExcel,
  FaDownload,
  FaChartBar,
  FaTable
} from 'react-icons/fa';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Payroll');

  // 🔹 Module 9 – explicit actions
  const generateReport = (name) => {
    alert(`${name} generated successfully`);
  };

  const exportReport = (type, name) => {
    alert(`${name} exported as ${type}`);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reports & Analytics
          </h1>
          <p className="text-gray-500">
            Download and analyze your organization's financial data
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 hover:bg-blue-100 transition">
          <FaChartBar /> Analytics View
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {Object.keys(reports).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} Reports
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports[activeTab].map((report, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition">
                <FaTable className="text-gray-400 group-hover:text-blue-500" />
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
                {report.format}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 mb-1">{report.name}</h3>
            <p className="text-xs text-gray-500 mb-6">{report.date}</p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => generateReport(report.name)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <FaDownload className="text-xs" /> Generate
              </button>

              <button
                onClick={() => exportReport('PDF', report.name)}
                className="px-3 bg-gray-50 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <FaFilePdf />
              </button>

              <button
                onClick={() => exportReport('CSV', report.name)}
                className="px-3 bg-gray-50 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <FaFileExcel />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Builder */}
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Custom Reports</h2>
          <p className="text-blue-200 text-sm max-w-lg mb-6">
            Need a specific report layout? Our custom report builder allows you to
            select fields and filters to match your local compliance requirements.
          </p>
          <button
            onClick={() => alert('Custom Report Builder Launched')}
            className="bg-white text-blue-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-lg"
          >
            Launch Report Builder
          </button>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
          <FaFileExcel size={240} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
