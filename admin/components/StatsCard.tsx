
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 hover:shadow-2xl hover:shadow-black/40 transition-all duration-500 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] mb-2 uppercase">{label}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-black tracking-tighter text-white">{value}</h3>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-500 mb-1.5">{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
