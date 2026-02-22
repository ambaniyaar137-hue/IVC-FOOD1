
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, Filter, MoreVertical } from 'lucide-react';

const ManageUsers: React.FC = () => {
  const users = [
    { id: 'USR-1001', name: 'Alex Johnson', email: 'alex@example.com', phone: '+91 98765 43210', device: 'iPhone 14', balance: '₹1,200', status: 'ACTIVE' },
    { id: 'USR-1002', name: 'Sarah Smith', email: 'sarah@example.com', phone: '+91 98765 43211', device: 'Pixel 7', balance: '₹450', status: 'ACTIVE' },
    { id: 'USR-1003', name: 'Mike Ross', email: 'mike@example.com', phone: '+91 98765 43212', device: 'MacBook Pro', balance: '₹0', status: 'BANNED' },
    { id: 'USR-1004', name: 'Rachel Zane', email: 'rachel@example.com', phone: '+91 98765 43213', device: 'Samsung S23', balance: '₹2,100', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name, email..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-[#111827] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-3">
            <Filter size={16} /> Filter
          </button>
          <ExportButtons data={users} fileName="users_list" title="Registered Users Report" />
        </div>
      </div>

      <DataTable 
        headers={['User ID', 'Name', 'Contact', 'Device', 'Wallet', 'Status', 'Actions']}
        data={users}
        renderRow={(user, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{user.id}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{user.email}</p>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{user.phone}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{user.device}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-[#FF6A00]">{user.balance}</span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {user.status}
              </span>
            </td>
            <td className="px-8 py-6">
              <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                <MoreVertical size={18} />
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default ManageUsers;
