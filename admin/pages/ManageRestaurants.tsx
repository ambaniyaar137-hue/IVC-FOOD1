
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, Plus, MapPin, Star, MoreVertical } from 'lucide-react';

const ManageRestaurants: React.FC = () => {
  const restaurants = [
    { id: 'RES-5001', name: 'Pizza Palace', owner: 'John Doe', location: 'Central Hub', rating: 4.8, orders: 1240, revenue: '₹3,45,000', status: 'ACTIVE' },
    { id: 'RES-5002', name: 'Burger King', owner: 'Jane Smith', location: 'West District', rating: 4.5, orders: 890, revenue: '₹2,10,000', status: 'ACTIVE' },
    { id: 'RES-5003', name: 'Noodle Express', owner: 'Mike Ross', location: 'North Station', rating: 4.2, orders: 450, revenue: '₹95,000', status: 'PENDING' },
    { id: 'RES-5004', name: 'Taco Bell', owner: 'Rachel Zane', location: 'South Plaza', rating: 4.6, orders: 670, revenue: '₹1,45,000', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search restaurants..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-[#FF6A00] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-3">
            <Plus size={18} /> Add Restaurant
          </button>
          <ExportButtons data={restaurants} fileName="restaurants_list" title="Partner Restaurants Report" />
        </div>
      </div>

      <DataTable 
        headers={['Restaurant', 'Owner', 'Location', 'Performance', 'Revenue', 'Status', 'Actions']}
        data={restaurants}
        renderRow={(res, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xs text-[#FF6A00]">
                  {res.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-black text-white">{res.name}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{res.owner}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={14} />
                <span className="text-xs font-bold">{res.location}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black">{res.rating}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{res.orders} Orders</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-[#FF6A00]">{res.revenue}</span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                res.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {res.status}
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

export default ManageRestaurants;
