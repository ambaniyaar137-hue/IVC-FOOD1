
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname.split('/').pop() || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-300">
      <Sidebar />
      <main className="flex-1 ml-72 flex flex-col">
        <Topbar title={getTitle()} />
        <div className="p-10 flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
