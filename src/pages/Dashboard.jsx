import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import {
    FaUsers, FaMoneyBillWave, FaCalendarCheck, FaClock,
    FaArrowRight, FaFileInvoiceDollar, FaChartLine,
    FaUserTie, FaBriefcase, FaHandHoldingUsd
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Add this function at top of dashboard.js
function checkTokenExpiry() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    logoutUser();
    return false;
  }

  try {
    // Decode JWT payload (no verification needed for expiry check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      console.log('Token expired, logging out...');
      logoutUser();
      return false;
    }
  } catch (e) {
    logoutUser();
    return false;
  }
  return true;
}

function logoutUser() {
  localStorage.clear();
  window.location.href = '/pages/login.html';
}

// Check on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!checkTokenExpiry()) return;
  
  // Your existing dashboard code...
});

// Auto-check every 5 minutes
setInterval(checkTokenExpiry, 5 * 60 * 1000);
// --- Shared Components ---
const StatCard = ({ title, value, icon: Icon, color, link, subtext }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden" style={{ borderColor: color }}>
        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-4 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
                <Icon className="text-2xl" style={{ color: color }} />
            </div>
        </div>
        {link && (
            <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
                <Link to={link} className="text-sm font-medium flex items-center hover:underline" style={{ color: color }}>
                    View Details <FaArrowRight className="ml-2 w-3 h-3" />
                </Link>
            </div>
        )}
        {/* Decorator */}
        <div className="absolute -bottom-4 -right-4 text-9xl opacity-5 pointer-events-none" style={{ color: color }}>
            <Icon />
        </div>
    </div>
);

const QuickAction = ({ title, desc, link, icon: Icon, color }) => (
    <Link to={link} className="group relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110`}>
            <Icon size={64} color={color} />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4`} style={{ backgroundColor: `${color}15` }}>
                <Icon size={24} color={color} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    </Link>
);

const WelcomeBanner = ({ user, icon: Icon = FaBriefcase }) => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-blue-100 mb-6">You are logged in as <span className="font-semibold">{user.role}</span>.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
            <Icon size={200} />
        </div>
    </div>
);

// --- Role Specific Dashboards ---

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState({ employees: 0, payrollCost: 0, pendingTasks: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const emps = await api.get('/employees');
                // Mocking other stats for demo
                setStats({
                    employees: emps.data ? emps.data.length : 0,
                    pendingTasks: 3,
                    payrollCost: 'Running'
                });
            } catch (error) {
                console.error('Error fetching admin stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <WelcomeBanner user={user} icon={FaUserTie} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Employees" value={stats.employees} icon={FaUsers} color="#4F46E5" link="/employees" subtext="Active workforce" />
                <StatCard title="Payroll Status" value={stats.payrollCost} icon={FaMoneyBillWave} color="#10B981" link="/payroll" subtext="Current cycle" />
                <StatCard title="Compliance" value="Good" icon={FaFileInvoiceDollar} color="#F59E0B" link="/compliance" subtext="No issues found" />
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Management Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickAction title="Add Employee" desc="Onboard new staff" link="/employees/new" icon={FaUsers} color="#EC4899" />
                    <QuickAction title="Run Payroll" desc="Process monthly salaries" link="/payroll" icon={FaMoneyBillWave} color="#10B981" />
                    <QuickAction title="Attendance Review" desc="Check marks & leaves" link="/attendance" icon={FaCalendarCheck} color="#3B82F6" />
                    <QuickAction title="Download Reports" desc="PF, ESI & Tax" link="/reports" icon={FaChartLine} color="#8B5CF6" />
                </div>
            </div>
        </div>
    );
};

const EmployeeDashboard = ({ user }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <WelcomeBanner user={user} icon={FaBriefcase} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Attendance" value="Present" icon={FaCheckCircle} color="#10B981" link="/attendance" subtext="Checked in today" />
                <StatCard title="Leave Balance" value="12 Days" icon={FaCalendarCheck} color="#F59E0B" subtext="Casual & Sick Leave" />
                <StatCard title="Next Payday" value="25 Days" icon={FaClock} color="#3B82F6" subtext="End of month" />
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Self Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickAction title="Mark Attendance" desc="Log your work hours" link="/attendance" icon={FaClock} color="#3B82F6" />
                    <QuickAction title="Tax Declaration" desc="Submit investment proofs" link="/tax-declaration" icon={FaFileInvoiceDollar} color="#8B5CF6" />
                    <QuickAction title="My Payslips" desc="View salary history" link="/my-payslips" icon={FaMoneyBillWave} color="#10B981" />
                </div>
            </div>
        </div>
    );
};

const FinanceDashboard = ({ user }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <WelcomeBanner user={user} icon={FaHandHoldingUsd} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Payout" value="$45,000" icon={FaMoneyBillWave} color="#10B981" subtext="Last month processed" />
                <StatCard title="Tax Liability" value="$4,500" icon={FaFileInvoiceDollar} color="#EF4444" subtext="Pending remittance" />
                <StatCard title="Reports Generated" value="8" icon={FaChartLine} color="#3B82F6" link="/reports" subtext="This quarter" />
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Finance Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuickAction title="View Reports" desc="Download statutory reports" link="/reports" icon={FaChartLine} color="#8B5CF6" />
                    <QuickAction title="Payroll History" desc="Audit past transactions" link="/payroll" icon={FaMoneyBillWave} color="#10B981" />
                </div>
            </div>
        </div>
    );
};
import { FaCheckCircle } from 'react-icons/fa'; // Import missing icon

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="text-center p-10">Loading...</div>;

    // Role Routing
    if (['Super Admin', 'Payroll Admin', 'HR Admin'].includes(user.role)) {
        return <AdminDashboard user={user} />;
    } else if (user.role === 'Finance') {
        return <FinanceDashboard user={user} />;
    } else {
        return <EmployeeDashboard user={user} />;
    }
};

export default Dashboard;
