
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Shield, Bell, 
  Database, Globe, Save, RefreshCw 
} from 'lucide-react';
import { toggleGSheetSync } from '../services/googleSheetService';

const Settings: React.FC = () => {
  const [gsheetSync, setGsheetSync] = useState(() => localStorage.getItem('admin_gsheet_sync') === 'true');
  const [isSaving, setIsSaving] = useState(false);

  const handleSyncToggle = () => {
    const newVal = !gsheetSync;
    setGsheetSync(newVal);
    toggleGSheetSync(newVal);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tight text-white">System Settings</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Global Configuration & Security</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#FF6A00] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Google Sheet Sync */}
        <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Database size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Google Sheet Real-time Sync</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Automatically append orders and transactions to your master sheet.</p>
              </div>
            </div>
            <button 
              onClick={handleSyncToggle}
              className={`w-14 h-8 rounded-full transition-all relative ${gsheetSync ? 'bg-emerald-500' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${gsheetSync ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sheet ID</span>
              <span className="text-xs font-mono text-slate-400">1x9...zPq2</span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10">
          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <Shield size={18} className="text-blue-500" /> Security & Access
          </h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tight">Two-Factor Authentication</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Mandatory for Super Admins</p>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tight">Session Expiration</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Auto-logout after inactivity</p>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24 Hours</span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-10">
          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <Bell size={18} className="text-amber-500" /> System Notifications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['New Order Alerts', 'Rider Payout Requests', 'Restaurant Onboarding', 'System Errors'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-black text-white uppercase tracking-tight">{item}</span>
                <button className="w-10 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
