
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import ExportButtons from '../components/ExportButtons';
import { Calendar, TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';

const Reports: React.FC = () => {
  const revenueData = [
    { name: 'Mon', revenue: 45000, orders: 120 },
    { name: 'Tue', revenue: 52000, orders: 145 },
    { name: 'Wed', revenue: 48000, orders: 130 },
    { name: 'Thu', revenue: 61000, orders: 160 },
    { name: 'Fri', revenue: 55000, orders: 150 },
    { name: 'Sat', revenue: 72000, orders: 210 },
    { name: 'Sun', revenue: 68000, orders: 195 },
  ];

  const topItems = [
    { name: 'Cheese Pizza', sales: 450, revenue: '₹1,35,000' },
    { name: 'Veg Burger', sales: 380, revenue: '₹68,400' },
    { name: 'Noodle Bowl', sales: 310, revenue: '₹77,500' },
    { name: 'Taco Supreme', sales: 290, revenue: '₹58,000' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tight text-white">Advanced Analytics</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Comprehensive Performance Reports</p>
        </div>
        <ExportButtons data={revenueData} fileName="performance_report" title="System Performance Analytics" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <TrendingUp size={18} className="text-[#FF6A00]" /> Revenue Trend
            </h4>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last 7 Days</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Bar dataKey="revenue" fill="#FF6A00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume */}
        <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <ShoppingBag size={18} className="text-blue-500" /> Order Volume
            </h4>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last 7 Days</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, fill: '#3B82F6', strokeWidth: 3, stroke: '#111827' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10">
        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
          <DollarSign size={18} className="text-emerald-500" /> Top Selling Items
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topItems.map((item, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
              <p className="text-xs font-black text-white uppercase tracking-tight">{item.name}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sales</p>
                  <p className="text-lg font-black text-white">{item.sales}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Revenue</p>
                  <p className="text-sm font-black text-[#FF6A00]">{item.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
