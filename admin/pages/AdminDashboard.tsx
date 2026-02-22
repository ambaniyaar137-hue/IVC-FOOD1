
import React from 'react';
import { 
  ShoppingBag, IndianRupee, Store, Bike, 
  Users, Wallet, ChevronDown 
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { RevenueChart, DistributionChart } from '../components/Charts';
import DataTable from '../components/DataTable';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Orders', value: '1,240', icon: ShoppingBag, color: 'bg-blue-500', trend: '+12.5%' },
    { label: 'Net Revenue', value: '₹4,28,500', icon: IndianRupee, color: 'bg-emerald-500', trend: '+8.2%' },
    { label: 'Live Partners', value: '51', icon: Store, color: 'bg-orange-500', trend: '+2' },
    { label: 'Active Riders', value: '51', icon: Bike, color: 'bg-purple-500', trend: '+5' },
    { label: 'Total Customers', value: '8,420', icon: Users, color: 'bg-indigo-500', trend: '+142' },
    { label: 'Wallet Balance', value: '₹1,12,000', icon: Wallet, color: 'bg-amber-500', trend: 'Stable' },
  ];

  const chartData = [
    { name: 'Mon', revenue: 45000 },
    { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 48000 },
    { name: 'Thu', revenue: 61000 },
    { name: 'Fri', revenue: 55000 },
    { name: 'Sat', revenue: 72000 },
    { name: 'Sun', revenue: 68000 },
  ];

  const distributionData = [
    { name: 'Restaurants', value: 51 },
    { name: 'Riders', value: 51 },
    { name: 'Managers', value: 12 },
  ];

  const recentOrders = [
    { id: 'ORD-9921', customer: 'Alex Johnson', restaurant: 'Pizza Palace', amount: '₹450', status: 'DELIVERED' },
    { id: 'ORD-9922', customer: 'Sarah Smith', restaurant: 'Burger King', amount: '₹280', status: 'PREPARING' },
    { id: 'ORD-9923', customer: 'Mike Ross', restaurant: 'Noodle Express', amount: '₹520', status: 'PLACED' },
    { id: 'ORD-9924', customer: 'Rachel Zane', restaurant: 'Taco Bell', amount: '₹340', status: 'OUT_FOR_DELIVERY' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#111827] rounded-[3rem] border border-white/5 p-10 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black tracking-tight text-white">Revenue Analysis</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Global Transaction Feed</p>
            </div>
            <button className="bg-white/5 px-5 py-2.5 rounded-2xl flex items-center gap-4 border border-white/5 text-[10px] font-black tracking-widest text-white hover:bg-white/10 transition-all">
              WEEKLY <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>
          <RevenueChart data={chartData} dataKey="revenue" color="#FF6A00" />
        </div>

        {/* Fleet Distribution */}
        <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10 flex flex-col">
          <div className="mb-10">
            <h3 className="text-xl font-black tracking-tight text-white">Fleet Distribution</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Active Infrastructure</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <DistributionChart data={distributionData} />
            <div className="w-full space-y-4 mt-8">
              {distributionData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-[#FF6A00]' : i === 1 ? 'bg-[#3B82F6]' : 'bg-[#10B981]'}`} />
                    <span className="text-[11px] font-black text-slate-500 tracking-widest uppercase">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">Recent Orders</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Live Transaction Stream</p>
          </div>
          <button className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest hover:underline">View All Orders</button>
        </div>
        
        <DataTable 
          headers={['Order ID', 'Customer', 'Restaurant', 'Amount', 'Status']}
          data={recentOrders}
          renderRow={(order, i) => (
            <tr key={i} className="group hover:bg-white/[0.02] transition-all">
              <td className="px-8 py-6">
                <span className="text-xs font-black text-white">{order.id}</span>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs font-bold text-slate-400">{order.customer}</span>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs font-bold text-slate-400">{order.restaurant}</span>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs font-black text-[#FF6A00]">{order.amount}</span>
              </td>
              <td className="px-8 py-6">
                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                  order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 
                  order.status === 'PREPARING' ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
