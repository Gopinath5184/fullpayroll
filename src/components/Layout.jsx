import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-gray-200 z-10">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        <span className="text-blue-600">Payroll</span> Management System
                    </h2>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <FaUserCircle className="text-gray-400 text-xl" />
                            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        </div>

                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
