
import React from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import { Search, Monitor, Globe, ShieldCheck } from 'lucide-react';

const DeviceSessions: React.FC = () => {
  const sessions = [
    { id: 'SES-8821', user: 'Alex Johnson', device: 'iPhone 14 Pro', browser: 'Safari', ip: '192.168.1.45', login: '20 Feb, 09:20 AM', status: 'ACTIVE' },
    { id: 'SES-8822', user: 'Sarah Smith', device: 'Pixel 7', browser: 'Chrome', ip: '103.44.21.12', login: '20 Feb, 10:15 AM', status: 'ACTIVE' },
    { id: 'SES-8823', user: 'Mike Ross', device: 'MacBook Pro', browser: 'Chrome', ip: '172.16.0.11', login: '19 Feb, 08:45 PM', status: 'EXPIRED' },
    { id: 'SES-8824', user: 'Rachel Zane', device: 'Samsung S23', browser: 'Samsung Internet', ip: '45.22.11.90', login: '19 Feb, 07:12 PM', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search sessions by user or IP..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons data={sessions} fileName="device_sessions" title="User Login & Device Sessions Report" />
        </div>
      </div>

      <DataTable 
        headers={['Session ID', 'User', 'Device & Browser', 'IP Address', 'Login Time', 'Status']}
        data={sessions}
        renderRow={(ses, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{ses.id}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{ses.user}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-500">
                  <Monitor size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{ses.device}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{ses.browser}</p>
                </div>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Globe size={14} />
                <span className="text-xs font-bold">{ses.ip}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ses.login}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className={ses.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-600'} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  ses.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-600'
                }`}>
                  {ses.status}
                </span>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default DeviceSessions;
