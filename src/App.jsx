import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComplianceConfig from './pages/ComplianceConfig';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import SalaryStructureConfig from './pages/SalaryStructureConfig';
import Attendance from './pages/Attendance';
import PayrollProcess from './pages/PayrollProcess';
import Payslip from './pages/Payslip';
import MyPayslips from './pages/MyPayslips';
import TaxDeclaration from './pages/TaxDeclaration';
import Reports from './pages/Reports';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/compliance" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Payroll Admin']}>
                  <ComplianceConfig />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/salary-config" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Payroll Admin', 'HR Admin']}>
                  <SalaryStructureConfig />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payroll" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Payroll Admin']}>
                  <PayrollProcess />
                </ProtectedRoute>
              } />
              <Route path="/payslip/:id" element={<Payslip />} />
              <Route path="/my-payslips" element={<MyPayslips />} />
              <Route path="/tax-declaration" element={<TaxDeclaration />} />
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Payroll Admin', 'Finance']}>
                  <Reports />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
