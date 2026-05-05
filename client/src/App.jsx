import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';

import Login from './pages/Login';
import Layout from './Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Officer Pages
import RecordDistribution from './pages/officer/RecordDistribution';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import TransactionHistory from './pages/officer/TransactionHistory';
import BeneficiaryList from './pages/officer/BeneficiaryList';

// Supervisor & Admin Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import ConflictsPage from './pages/supervisor/ConflictsPage';
import TransactionsPage from './pages/supervisor/TransactionsPage';
import ShopsPage from './pages/supervisor/ShopsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BeneficiariesPage from './pages/admin/BeneficiariesPage';
import AdminShopsPage from './pages/admin/AdminShopsPage';
import UsersPage from './pages/admin/UsersPage';
import ReportsPage from './pages/admin/ReportsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              
              {/* Main Layout wrapper for authenticated routes */}
              <Route element={<Layout />}>
                
                {/* Fallback root */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Officer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
                  <Route path="/officer" element={<OfficerDashboard />} />
                  <Route path="/officer/record" element={<RecordDistribution />} />
                  <Route path="/officer/history" element={<TransactionHistory />} />
                  <Route path="/officer/beneficiaries" element={<BeneficiaryList />} />
                </Route>

                {/* Supervisor Routes */}
                <Route element={<ProtectedRoute allowedRoles={['supervisor', 'admin']} />}>
                  <Route path="/supervisor" element={<SupervisorDashboard />} />
                  <Route path="/supervisor/conflicts" element={<ConflictsPage />} />
                  <Route path="/supervisor/transactions" element={<TransactionsPage />} />
                  <Route path="/supervisor/shops" element={<ShopsPage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/beneficiaries" element={<BeneficiariesPage />} />
                  <Route path="/admin/shops" element={<AdminShopsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                </Route>

                {/* Unauthorized */}
                <Route path="/unauthorized" element={
                  <div className="flex items-center justify-center h-full text-center">
                    <h1 className="text-3xl text-red-600 font-bold">403 - Unauthorized</h1>
                  </div>
                } />
              </Route>
              
            </Routes>
          </BrowserRouter>
        </SyncProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;