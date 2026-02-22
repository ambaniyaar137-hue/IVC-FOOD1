
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, ShoppingBag, User, Store, MoreVertical } from 'lucide-react';

const ManageOrders: React.FC = () => {
  const orders = [
    { id: 'ORD-9921', customer: 'Alex Johnson', restaurant: 'Pizza Palace', rider: 'Rahul Kumar', amount: '₹450', mode: 'UPI', status: 'DELIVERED', time: '10:45 AM' },
    { id: 'ORD-9922', customer: 'Sarah Smith', restaurant: 'Burger King', rider: 'Amit Singh', amount: '₹280', mode: 'CARD', status: 'PREPARING', time: '11:12 AM' },
    { id: 'ORD-9923', customer: 'Mike Ross', restaurant: 'Noodle Express', rider: 'Pending', amount: '₹520', mode: 'WALLET', status: 'PLACED', time: '11:30 AM' },
    { id: 'ORD-9924', customer: 'Rachel Zane', restaurant: 'Taco Bell', rider: 'Vikram Batra', amount: '₹340', mode: 'CASH', status: 'OUT_FOR_DELIVERY', time: '11:45 AM' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search orders by ID, customer..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons data={orders} fileName="orders_report" title="Order Transaction History" />
        </div>
      </div>

      <DataTable 
        headers={['Order ID', 'Customer', 'Restaurant', 'Rider', 'Bill', 'Payment', 'Status', 'Actions']}
        data={orders}
        renderRow={(order, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{order.id}</span>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{order.time}</p>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2 text-slate-400">
                <User size={14} />
                <span className="text-xs font-bold">{order.customer}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2 text-slate-400">
                <Store size={14} />
                <span className="text-xs font-bold">{order.restaurant}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className={`text-xs font-bold ${order.rider === 'Pending' ? 'text-rose-500' : 'text-slate-400'}`}>{order.rider}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-[#FF6A00]">{order.amount}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-lg uppercase tracking-widest">{order.mode}</span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 
                order.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-500' : 
                'bg-blue-500/10 text-blue-500'
              }`}>
                {order.status.replace('_', ' ')}
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

export default ManageOrders;
