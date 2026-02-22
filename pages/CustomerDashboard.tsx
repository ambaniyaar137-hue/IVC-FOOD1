
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutDashboard, Wallet, ShoppingBag, Heart, 
  MapPin, HelpCircle, ChevronRight, Bell, 
  Settings, Star, Clock, CheckCircle2, 
  ArrowUpRight, TrendingUp, ShieldCheck, Zap, ChevronLeft
} from 'lucide-react';
import { useApp } from '../App';
import { OrderStatus } from '../types';

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, designConfig, unreadCount } = useApp();

  const stats = [
    { label: 'Total Orders', value: '24', icon: ShoppingBag, color: '#3B82F6' },
    { label: 'Favorites', value: '12', icon: Heart, color: '#EF4444' },
    { label: 'Saved Places', value: '3', icon: MapPin, color: '#10B981' },
  ];

  const recentActivity = [
    { 
      id: 'ORD9122', 
      restaurant: 'The Signature Burger', 
      status: OrderStatus.PLACED, 
      amount: '₹450.00',
      time: '2 mins ago',
      icon: Clock
    },
    { 
      id: 'ORD8821', 
      restaurant: 'The Pizza Palace', 
      status: OrderStatus.DELIVERED, 
      amount: '₹320.00',
      time: 'Yesterday',
      icon: CheckCircle2
    }
  ];

  const quickLinks = [
    { label: 'Wallet', icon: Wallet, path: '/profile/wallet', color: 'bg-blue-50 text-blue-600' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders', color: 'bg-orange-50 text-orange-600' },
    { label: 'Support', icon: HelpCircle, path: '/profile/support', color: 'bg-purple-50 text-purple-600' },
    { label: 'Settings', icon: Settings, path: '/profile/details', color: 'bg-slate-50 text-slate-600' },
  ];

  return (
    <div className="min-h-screen pb-32 pt-safe-premium px-6 bg-slate-50/30 font-['Plus_Jakarta_Sans']">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft size={20} strokeWidth={3} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
              <img 
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#1C1917] tracking-tight">
                Hi, {user?.name.split(' ')[0]}!
              </h1>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verified</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center relative active:scale-95 transition-all shadow-sm"
        >
          <Bell size={20} className="text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </header>

      {/* WALLET CARD */}
      <section className="mb-8">
        <div 
          className="relative overflow-hidden rounded-[32px] p-8 text-white shadow-2xl shadow-orange-500/20"
          style={{ backgroundColor: designConfig.primaryColor }}
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 opacity-80">
                <Wallet size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Wallet Balance</span>
              </div>
              <TrendingUp size={20} className="opacity-60" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black tracking-tighter">₹{user?.walletBalance?.toFixed(2) || '0.00'}</span>
              <span className="text-xs font-bold opacity-60">Available</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/profile/wallet')}
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl py-3.5 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Zap size={14} fill="white" /> Add Funds
              </button>
              <button 
                onClick={() => navigate('/profile/wallet')}
                className="w-14 h-14 bg-white text-orange-600 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg"
                style={{ color: designConfig.primaryColor }}
              >
                <ArrowUpRight size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
            >
              <stat.icon size={18} strokeWidth={3} />
            </div>
            <span className="text-lg font-black text-slate-900 leading-none">{stat.value}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* QUICK LINKS */}
      <section className="mb-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-2 mb-4">Quick Access</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <button 
              key={i}
              onClick={() => navigate(link.path)}
              className="flex flex-col items-center gap-3 active:scale-90 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 ${link.color}`}>
                <link.icon size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black text-slate-600 tracking-tight">{link.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Recent Activity</h2>
          <button 
            onClick={() => navigate('/orders')}
            className="text-[10px] font-black text-orange-500 uppercase tracking-widest"
            style={{ color: designConfig.primaryColor }}
          >
            View All
          </button>
        </div>
        
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          {recentActivity.map((activity, i) => (
            <div 
              key={i}
              onClick={() => navigate('/orders')}
              className={`flex items-center justify-between p-5 active:bg-slate-50 transition-colors cursor-pointer ${i !== recentActivity.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                  <activity.icon size={20} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-slate-900 tracking-tight">{activity.restaurant}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{activity.time} • {activity.amount}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" strokeWidth={3} />
            </div>
          ))}
        </div>
      </section>

      {/* ACCOUNT STATUS */}
      <section>
        <div className="bg-slate-900 rounded-[32px] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Star size={24} fill="#FBBF24" className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-[15px] font-black tracking-tight">Foodi Gold Member</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">You've saved ₹1,240 this month</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-600" />
        </div>
      </section>

    </div>
  );
};
