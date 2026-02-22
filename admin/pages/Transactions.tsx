
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Transactions: React.FC = () => {
  const transactions = [
    { id: 'TXN-4401', user: 'Alex Johnson', gateway: 'RAZORPAY', amount: '₹450', type: 'DEBIT', status: 'SUCCESS', date: '20 Feb, 09:20 AM' },
    { id: 'TXN-4402', user: 'Sarah Smith', gateway: 'WALLET', amount: '₹280', type: 'DEBIT', status: 'SUCCESS', date: '20 Feb, 10:15 AM' },
    { id: 'TXN-4403', user: 'Mike Ross', gateway: 'STRIPE', amount: '₹1,000', type: 'CREDIT', status: 'SUCCESS', date: '19 Feb, 08:45 PM' },
    { id: 'TXN-4404', user: 'Rachel Zane', gateway: 'PAYTM', amount: '₹340', type: 'DEBIT', status: 'FAILED', date: '19 Feb, 07:12 PM' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons data={transactions} fileName="transactions_report" title="Financial Transaction Log" />
        </div>
      </div>

      <DataTable 
        headers={['Transaction ID', 'User', 'Gateway', 'Amount', 'Type', 'Status', 'Timestamp']}
        data={transactions}
        renderRow={(txn, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{txn.id}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{txn.user}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-lg uppercase tracking-widest">{txn.gateway}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{txn.amount}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                {txn.type === 'CREDIT' ? (
                  <ArrowDownLeft size={14} className="text-emerald-500" />
                ) : (
                  <ArrowUpRight size={14} className="text-[#FF6A00]" />
                )}
                <span className={`text-[10px] font-black uppercase tracking-widest ${txn.type === 'CREDIT' ? 'text-emerald-500' : 'text-[#FF6A00]'}`}>
                  {txn.type}
                </span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                txn.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {txn.status}
              </span>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{txn.date}</span>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default Transactions;
