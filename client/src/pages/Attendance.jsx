import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaClock, FaFilter, FaLock, FaLockOpen } from 'react-icons/fa';

const Attendance = () => {
    const { user } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [isClosed, setIsClosed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAttendance();
        fetchClosureStatus();
        if (user.role !== 'Employee') {
            fetchEmployees();
        }
    }, [month, year, selectedEmployee]);

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get('/employees');
            setEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const params = { month, year };
            if (selectedEmployee) params.employeeId = selectedEmployee;

            const { data } = await api.get('/attendance', { params });
            setAttendance(data);
        } catch (error) {
            console.error('Error fetching attendance', error);
        }
    };

    const fetchClosureStatus = async () => {
        try {
            // Check for today's closure by default
            const { data } = await api.get('/attendance/closure-status');
            setIsClosed(data.isClosed);
        } catch (error) {
            console.error('Error fetching closure status', error);
        }
    };

    const handleMarkAttendance = async (status) => {
        if (isClosed && user.role === 'Employee') {
            alert('Attendance for today is closed.');
            return;
        }
        try {
            setLoading(true);
            await api.post('/attendance', {
                date: new Date(),
                status,
                checkIn: status === 'Present' ? new Date() : null
            });
            fetchAttendance();
            alert('Attendance marked successfully');
        } catch (error) {
            console.error('Error marking attendance', error);
            alert(error.response?.data?.message || 'Error marking attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleClosure = async (close) => {
        try {
            setLoading(true);
            const endpoint = close ? '/attendance/close' : '/attendance/reopen';
            await api.post(endpoint, { date: new Date() });
            setIsClosed(close);
            alert(`Attendance ${close ? 'closed' : 'reopened'} successfully.`);
        } catch (error) {
            console.error('Closure action failed', error);
            alert('Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOT = async (recordId, otHours) => {
        try {
            const record = attendance.find(r => r._id === recordId);
            await api.post('/attendance', {
                employeeId: record.employee._id,
                date: new Date(record.date),
                overtimeHours: parseFloat(otHours) || 0
            });
            fetchAttendance();
        } catch (error) {
            console.error('Error updating OT', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Attendance Center</h1>
                    <p className="text-gray-500 mt-1">Track daily check-ins and manage closures</p>
                </div>
                {(user.role === 'HR Admin' || user.role === 'Super Admin') && (
                    <div className="mt-4 md:mt-0">
                        {isClosed ? (
                            <button
                                onClick={() => handleToggleClosure(false)}
                                disabled={loading}
                                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm hover:shadow active:transform active:scale-95 disabled:opacity-50"
                            >
                                <FaLockOpen /> Reopen Attendance
                            </button>
                        ) : (
                            <button
                                onClick={() => handleToggleClosure(true)}
                                disabled={loading}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm hover:shadow active:transform active:scale-95 disabled:opacity-50"
                            >
                                <FaLock /> Close Attendance
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Mark Attendance Card */}
            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${isClosed && user.role === 'Employee' ? 'opacity-75' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <FaClock className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Mark Today's Attendance</h2>
                            <p className="text-sm text-gray-500 font-medium">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                {isClosed && <span className="ml-2 text-red-600 font-bold">(CLOSED)</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleMarkAttendance('Present')}
                            disabled={loading || (isClosed && user.role === 'Employee')}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-sm hover:shadow active:transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <FaCheckCircle /> Check In
                        </button>
                        <button
                            onClick={() => handleMarkAttendance('Leave')}
                            disabled={loading || (isClosed && user.role === 'Employee')}
                            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition shadow-sm hover:shadow active:transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <FaTimesCircle /> Mark Leave
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters (Admin Only) */}
            {user.role !== 'Employee' && (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                        <FaFilter />
                        <span>Filter Records</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="border border-gray-300 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            <option value="">All Employees</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.user?.name} ({emp.employeeId})</option>
                            ))}
                        </select>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="border border-gray-300 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Month {m}</option>
                            ))}
                        </select>
                        <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-300 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                {user.role !== 'Employee' && <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>}
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">OT Hours</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendance.length > 0 ? (
                                attendance.map((record, index) => (
                                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        {user.role !== 'Employee' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {record.employee?.employeeId}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${record.status === 'Present' ? 'bg-green-500' :
                                                    record.status === 'Absent' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                    }`}></span>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.role !== 'Employee' ? (
                                                <input
                                                    type="number"
                                                    defaultValue={record.overtimeHours || 0}
                                                    onBlur={(e) => handleUpdateOT(record._id, e.target.value)}
                                                    className="w-16 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            ) : (
                                                <span>{record.overtimeHours || 0}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user.role !== 'Employee' ? 5 : 4} className="px-6 py-10 text-center text-gray-500">
                                        No attendance records found for this selection.
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

export default Attendance;
