import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaHistory, FaUser, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/reports/audit-logs');
                setLogs(res.data);
            } catch (error) {
                console.error('Error fetching audit logs:', error);
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading audit logs...</div>;

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <FaHistory className="text-2xl text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4 text-right">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.length > 0 ? logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-blue-600">{log.action}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{log.user?.name || 'System'}</span>
                                            <span className="text-xs text-gray-500">{log.user?.role || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm max-w-md truncate" title={log.details}>
                                        {log.details || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.ip || 'Local'}</td>
                                    <td className="px-6 py-4 text-right text-gray-500 text-sm">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <FaInfoCircle className="mx-auto mb-2 text-2xl" />
                                        No audit logs found.
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

export default AuditLogs;
