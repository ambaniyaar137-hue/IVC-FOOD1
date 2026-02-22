
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageRestaurants from './pages/ManageRestaurants';
import ManageRiders from './pages/ManageRiders';
import ManageOrders from './pages/ManageOrders';
import Transactions from './pages/Transactions';
import Coupons from './pages/Coupons';
import WalletManagement from './pages/WalletManagement';
import DeviceSessions from './pages/DeviceSessions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const AdminApp: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="restaurants" element={<ManageRestaurants />} />
        <Route path="riders" element={<ManageRiders />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="wallets" element={<WalletManagement />} />
        <Route path="sessions" element={<DeviceSessions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<div className="p-20 text-center font-black text-slate-700 uppercase tracking-[0.5em]">404 | Module Not Found</div>} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
