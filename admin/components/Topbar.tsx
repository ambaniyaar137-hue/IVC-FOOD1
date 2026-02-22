
import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  return (
    <header className="h-24 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{title}</h2>
        <div className="relative hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Global search..." 
            className="bg-white/5 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-medium w-80 text-white focus:ring-2 focus:ring-[#FF6A00]/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all relative">
          <Bell size={20} />
          <div className="absolute top-3 right-3 w-2 h-2 bg-[#FF6A00] rounded-full border-2 border-[#0B0F19]" />
        </button>
        
        <div className="h-10 w-[1px] bg-white/5" />
        
        <div className="flex items-center gap-4 bg-white/5 p-2 pr-5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 bg-[#FF6A00]/10 rounded-xl flex items-center justify-center text-[#FF6A00]">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs font-black tracking-tight text-white">Super Admin</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Master</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
