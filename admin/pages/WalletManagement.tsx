
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, Wallet, ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';

const WalletManagement: React.FC = () => {
  const wallets = [
    { id: 'WLT-1001', user: 'Alex Johnson', balance: '₹1,200', lastTxn: '₹450 (Debit)', date: '20 Feb, 09:20 AM', status: 'ACTIVE' },
    { id: 'WLT-1002', user: 'Sarah Smith', balance: '₹450', lastTxn: '₹280 (Debit)', date: '20 Feb, 10:15 AM', status: 'ACTIVE' },
    { id: 'WLT-1003', user: 'Mike Ross', balance: '₹0', lastTxn: '₹1,000 (Credit)', date: '19 Feb, 08:45 PM', status: 'FROZEN' },
    { id: 'WLT-1004', user: 'Rachel Zane', balance: '₹2,100', lastTxn: '₹340 (Debit)', date: '19 Feb, 07:12 PM', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search wallets by user..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons data={wallets} fileName="wallets_report" title="User Wallet Balances Report" />
        </div>
      </div>

      <DataTable 
        headers={['Wallet ID', 'User', 'Current Balance', 'Last Transaction', 'Last Activity', 'Status', 'Actions']}
        data={wallets}
        renderRow={(wlt, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{wlt.id}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{wlt.user}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-[#FF6A00]">{wlt.balance}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{wlt.lastTxn}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{wlt.date}</span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                wlt.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                {wlt.status}
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

export default WalletManagement;
