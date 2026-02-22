
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, Bike, Phone, MoreVertical } from 'lucide-react';

const ManageRiders: React.FC = () => {
  const riders = [
    { id: 'RID-2001', name: 'Rahul Kumar', phone: '+91 98765 00001', vehicle: 'BIKE', orders: 156, earnings: '₹12,450', status: 'ONLINE' },
    { id: 'RID-2002', name: 'Amit Singh', phone: '+91 98765 00002', vehicle: 'SCOOTER', orders: 89, earnings: '₹8,100', status: 'ON_ORDER' },
    { id: 'RID-2003', name: 'Suresh Raina', phone: '+91 98765 00003', vehicle: 'BIKE', orders: 210, earnings: '₹18,400', status: 'OFFLINE' },
    { id: 'RID-2004', name: 'Vikram Batra', phone: '+91 98765 00004', vehicle: 'CYCLE', orders: 45, earnings: '₹3,200', status: 'ONLINE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search riders..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons data={riders} fileName="riders_list" title="Delivery Fleet Report" />
        </div>
      </div>

      <DataTable 
        headers={['Rider', 'Contact', 'Vehicle', 'Assigned', 'Earnings', 'Status', 'Actions']}
        data={riders}
        renderRow={(rider, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                  <Bike size={20} />
                </div>
                <span className="text-xs font-black text-white">{rider.name}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Phone size={14} />
                <span className="text-xs font-bold">{rider.phone}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-black text-slate-400 bg-white/5 px-3 py-1 rounded-lg uppercase tracking-widest">{rider.vehicle}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{rider.orders} Orders</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-[#FF6A00]">{rider.earnings}</span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                rider.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500' : 
                rider.status === 'ON_ORDER' ? 'bg-blue-500/10 text-blue-500' : 
                'bg-white/5 text-slate-500'
              }`}>
                {rider.status.replace('_', ' ')}
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

export default ManageRiders;
