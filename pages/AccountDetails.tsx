
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, User, Mail, Phone, Check, X, Sparkles, Palette, RefreshCw } from 'lucide-react';
import { useApp } from '../App';

export const AccountDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, designConfig } = useApp();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 012-3456');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateIdentities = useCallback(() => {
    const styles = ['lorelei', 'adventurer', 'notionists', 'big-ears', 'avataaars', 'croodles'];
    const names = ['Felix', 'Aria', 'Jasper', 'Luna', 'Oliver', 'Milo'];
    return Array.from({ length: 18 }).map((_, i) => {
      const style = styles[Math.floor(Math.random() * styles.length)];
      const seed = Math.random().toString(36).substring(7);
      return { url: `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}` };
    });
  }, []);

  const [graphicIdentities, setGraphicIdentities] = useState(generateIdentities());

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl || avatarUrl);
    }
  }, [user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setGraphicIdentities(generateIdentities());
      setIsRefreshing(false);
    }, 600);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    const updatedUser = { ...user, name, email, phone, avatarUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-40 animate-native-fade pt-safe-premium px-6 min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--brand-bg)' }}>
      <div className="flex items-center gap-6 mb-12">
        <button onClick={() => navigate(-1)} className="p-3.5 bg-slate-50 text-slate-900 rounded-2xl shadow-sm border border-slate-100 active:scale-90 flex items-center justify-center">
          <ChevronLeft strokeWidth={4} size={22} />
        </button>
        <div>
           <h1 className="text-3xl font-black tracking-tighter text-[#1C1917]">Account</h1>
           <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60" style={{ color: designConfig.primaryColor }}>Identity Management</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-12 relative">
         <div className="relative group">
            <div className="w-36 h-36 rounded-[48px] border-4 p-2 shadow-2xl bg-white overflow-hidden flex items-center justify-center" style={{ borderColor: `${designConfig.primaryColor}11` }}>
               <img src={avatarUrl} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" alt="Active Identity" />
            </div>
            <button onClick={() => setShowPicker(true)} className="absolute -bottom-2 -right-2 w-12 h-12 text-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-white active:scale-90" style={{ backgroundColor: designConfig.primaryColor }}>
               <Palette size={20} strokeWidth={3} />
            </button>
         </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Display Name</label>
           <div className="relative group">
              <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" style={{ color: name ? designConfig.primaryColor : undefined }} />
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-transparent rounded-[28px] py-5 pl-16 pr-8 text-sm font-black outline-none focus:bg-white transition-all text-[#1C1917]" style={{ borderColor: name ? `${designConfig.primaryColor}22` : undefined }} />
           </div>
        </div>
        {/* Same for other fields... */}
      </div>

      <div className="mt-12">
         <button onClick={handleSave} disabled={saving} className={`w-full py-6 rounded-[28px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 text-white ${saved ? 'bg-emerald-500' : 'bg-[#1C1917]'}`} style={{ backgroundColor: !saved ? designConfig.primaryColor : undefined }}>
           {saving ? 'Syncing...' : saved ? <Check size={18} strokeWidth={4} /> : 'Confirm Identity'}
         </button>
      </div>

      {showPicker && (
        <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowPicker(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[56px] p-8 pb-12 shadow-2xl animate-native-up flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-8 shrink-0">
               <div>
                  <h2 className="text-2xl font-black text-[#1C1917]">Signature Avatars</h2>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Select or Refresh personas</p>
               </div>
               <div className="flex gap-2">
                 <button onClick={handleRefresh} className={`p-3 bg-orange-50 rounded-2xl active:scale-90 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: designConfig.primaryColor }}>
                    <RefreshCw size={20} strokeWidth={3} />
                 </button>
                 <button onClick={() => setShowPicker(false)} className="p-3 bg-slate-100 rounded-2xl"><X size={20} /></button>
               </div>
            </div>
            <div className={`grid grid-cols-3 gap-6 overflow-y-auto no-scrollbar flex-1 transition-opacity ${isRefreshing ? 'opacity-30' : 'opacity-100'}`}>
              {graphicIdentities.map((persona, i) => (
                <button key={i} onClick={() => { setAvatarUrl(persona.url); setShowPicker(false); }} className="relative aspect-square rounded-[36px] p-2 border-2 transition-all active:scale-95" style={{ borderColor: avatarUrl === persona.url ? designConfig.primaryColor : '#f8fafc' }}>
                   <img src={persona.url} className="w-full h-full object-contain" alt="persona" />
                   {avatarUrl === persona.url && <div className="absolute -top-1 -right-1 w-7 h-7 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white" style={{ backgroundColor: designConfig.primaryColor }}><Check size={14} strokeWidth={4} /></div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
