import { useState } from 'react';
import api from '../utils/api';

const Reports = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const downloadCSV = (data, filename) => {
        if (!data || data.length === 0) {
            alert('No data available');
            return;
        }
        const headers = Object.keys(data[0]);
        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...data.map(row => headers.map(h => row[h]).join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    };

    const handleDownload = async (type) => {
        try {
            const { data } = await api.get(`/reports/${type}`, { params: { month, year } });
            downloadCSV(data, `${type}_Report_${month}_${year}.csv`);
        } catch (error) {
            console.error('Error downloading report', error);
            alert('Error downloading report');
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Statutory Reports</h1>
                    <p className="text-gray-500">Generate and download compliance reports</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="w-full border-gray-300 bg-gray-50 rounded-lg shadow-sm p-2.5 outline-none focus:ring-2 focus:ring-purple-500 border transition">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Month {m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
                        <select value={year} onChange={e => setYear(e.target.value)} className="w-full border-gray-300 bg-gray-50 rounded-lg shadow-sm p-2.5 outline-none focus:ring-2 focus:ring-purple-500 border transition">
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 cursor-pointer group" onClick={() => handleDownload('pf')}>
                        <div className="mb-4 p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">PF Report (ECR)</h3>
                        <p className="text-sm text-gray-500 mb-4">Provident Fund Electronic Challan Return format for monthly filing.</p>
                        <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">Download CSV</button>
                    </div>

                    <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 cursor-pointer group" onClick={() => handleDownload('esi')}>
                        <div className="mb-4 p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">ESI Report</h3>
                        <p className="text-sm text-gray-500 mb-4">Detailed Employee State Insurance contribution data.</p>
                        <button className="w-full py-2 bg-white border border-green-200 text-green-600 rounded-lg font-medium hover:bg-green-50 transition">Download CSV</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
