
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, MapPin, CreditCard, 
  LogOut, ChevronLeft, ChevronRight, 
  Palette, ClipboardList, Heart, Sparkles, Check, X, HelpCircle, BadgeCheck, LayoutDashboard
} from 'lucide-react';
import { useApp, AppTheme } from '../App';

export const Profile: React.FC = () => {
  const { user, setUser, theme, setTheme, isWalletEnabled, designConfig } = useApp();
  const navigate = useNavigate();
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Identity seeds
  const quickPersonas = [
    { seed: 'Felix', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix' },
    { seed: 'Aria', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Aria' },
    { seed: 'Bear', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bear' },
    { seed: 'Alex', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex' },
    { seed: 'Luna', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna' },
  ];

  const themeOptions: { 
    id: AppTheme, 
    label: string, 
    surface: string, 
    headerColor: string, 
    buttonBg: string, 
    buttonText: string,
    isDark?: boolean 
  }[] = [
    { id: 'mint', label: 'Bold Mint Green', surface: '#F0FDF4', headerColor: '#DCFCE7', buttonBg: '#DCFCE7', buttonText: '#10B981' },
    { id: 'yellow', label: 'Bold Butter Yellow', surface: '#FFFBEB', headerColor: '#FEF3C7', buttonBg: '#FEF3C7', buttonText: '#F59E0B' },
    { id: 'blue', label: 'Bold Sky Blue', surface: '#EFF6FF', headerColor: '#DBEAFE', buttonBg: '#DBEAFE', buttonText: '#3B82F6' },
    { id: 'lavender', label: 'Bold Lavender', surface: '#F5F3FF', headerColor: '#F3E8FF', buttonBg: '#F3E8FF', buttonText: '#8B5CF6' },
    { id: 'champagne', label: 'Classic Signature', surface: '#FFFFFF', headerColor: '#FFF3E0', buttonBg: '#FFEDE0', buttonText: '#FF4D00' },
    { id: 'dark', label: 'Midnight OLED', surface: '#09090B', headerColor: '#1C1917', buttonBg: '#1C1917', buttonText: '#FFFFFF', isDark: true },
  ];

  const handleQuickSwitch = (url: string) => {
    if (!user) return;
    const updated = { ...user, avatarUrl: url };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const menuGroups = useMemo(() => [
    {
      title: 'Activity Hub',
      items: [
        { icon: LayoutDashboard, label: 'My Dashboard', action: () => navigate('/dashboard'), subtitle: 'OVERVIEW' },
        { icon: ClipboardList, label: 'Order List', action: () => navigate('/orders') },
        { icon: Heart, label: 'Favorites', action: () => navigate('/profile/favorites') },
        ...(isWalletEnabled ? [{ 
          icon: CreditCard, 
          label: 'Virtual Wallet Balance', 
          action: () => navigate('/profile/wallet'), 
          badge: `₹${user?.walletBalance?.toFixed(2) || '0.00'}` 
        }] : []),
        { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/profile/support') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: `Visual Identity`, action: () => setShowThemePicker(true), subtitle: theme.toUpperCase() },
        { icon: MapPin, label: 'Managed Addresses', action: () => navigate('/profile/locations') },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: User, label: 'Profile Details', action: () => navigate('/profile/details') },
        { icon: LogOut, label: 'Sign Out', action: handleLogout, danger: true },
      ]
    }
  ], [isWalletEnabled, theme, user]);

  const VerifiedBadge = ({ size = 16 }: { size?: number }) => (
    <div className="relative flex items-center justify-center">
      <svg 
        width={size * 1.6} 
        height={size * 1.6} 
        viewBox="0 0 24 24" 
        fill="#1D9BF0" 
        className="drop-shadow-sm"
      >
        <path d="M12 2L9.12 4.12L6.12 2.12L5 5.12L2 6.12L4.12 9L2.12 12L4.12 14.88L2.12 17.88L5 18.88L6.12 21.88L9.12 19.88L12 22L14.88 19.88L17.88 21.88L18.88 18.88L21.88 17.88L19.88 14.88L21.88 12L19.88 9.12L21.88 6.12L18.88 5.12L17.88 2.12L14.88 4.12L12 2Z" />
      </svg>
      <Check 
        size={size * 0.9} 
        className="absolute text-white" 
        strokeWidth={4.5} 
      />
    </div>
  );

  return (
    <div className="pb-32 pt-safe-premium px-5 animate-native-fade min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--brand-bg)' }}>
      
      {/* HEADER - FIXED BACK BUTTON AND TYPOGRAPHY */}
      <header className="flex items-center gap-6 mb-8 animate-in slide-in-from-top-4 duration-700">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 bg-white text-slate-900 rounded-[18px] shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center justify-center"
        >
          <ChevronLeft strokeWidth={4} size={22} />
        </button>
        <div>
           <h1 className="text-[26px] font-black tracking-tighter text-[#1C1917] leading-none">Profile</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Account Management</p>
        </div>
      </header>

      {/* Premium Hero Profile */}
      <div className="bg-white rounded-[40px] p-10 flex flex-col items-center text-center relative overflow-hidden border border-slate-100 shadow-sm mb-8">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />
        
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[36px] overflow-hidden border-2 border-slate-50 shadow-xl relative p-1.5 bg-white transition-all active:scale-95" onClick={() => navigate('/profile/details')}>
             <div className="w-full h-full rounded-[28px] overflow-hidden bg-slate-50/50 relative p-1">
               <img 
                 src={user?.avatarUrl || quickPersonas[0].url} 
                 alt="avatar" 
                 className="w-full h-full object-contain" 
               />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-lg">
             <VerifiedBadge size={14} />
          </div>
        </div>

        <div className="relative z-10 mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{user?.name || 'Signature Guest'}</h1>
            <VerifiedBadge size={10} />
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mt-1.5 leading-none">{user?.email || 'GUEST@FOODI.COM'}</p>
        </div>

        <div className="w-full pt-6 border-t border-slate-50">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-5">Instant Personas</p>
           <div className="flex justify-center gap-4">
              {quickPersonas.map((persona, i) => (
                <button 
                  key={i}
                  onClick={() => handleQuickSwitch(persona.url)}
                  className={`relative w-12 h-12 rounded-2xl p-1 transition-all duration-300 active:scale-75 ${user?.avatarUrl === persona.url ? 'bg-blue-600 shadow-lg scale-110 ring-4 ring-blue-50' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <img src={persona.url} className="w-full h-full object-contain" alt={persona.seed} />
                  {user?.avatarUrl === persona.url && (
                    <div className="absolute -top-1 -right-1">
                       <VerifiedBadge size={8} />
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {menuGroups.map(group => (
          <section key={group.title}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-6 mb-4">{group.title}</h2>
            <div className="rounded-[32px] bg-white border border-slate-100 shadow-sm overflow-hidden px-2">
              {group.items.map((item, idx) => (
                <div 
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center justify-between py-5 px-6 cursor-pointer active:bg-slate-50 transition-colors ${idx !== group.items.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-active:scale-90 ${item.danger ? 'bg-rose-50 text-rose-500' : 'bg-slate-50/50 text-slate-900'}`}>
                      <item.icon size={18} strokeWidth={2.5} style={{ color: !item.danger && item.label.includes('Visual') ? designConfig.primaryColor : undefined }} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-black text-[15px] tracking-tight ${item.danger ? 'text-rose-500' : 'text-slate-900'}`}>{item.label}</span>
                      {item.subtitle && <span className="text-[9px] font-black uppercase tracking-widest mt-0.5" style={{ color: designConfig.primaryColor }}>{item.subtitle}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     {item.badge && <span className="text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg" style={{ color: designConfig.primaryColor }}>{item.badge}</span>}
                     <ChevronRight size={16} className="text-slate-200" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* REFINED THEME PICKER MODAL */}
      {showThemePicker && (
        <div className="fixed inset-0 z-[5000] flex flex-col items-center justify-end">
           <div className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-md animate-fade-in" onClick={() => setShowThemePicker(false)} />
           <div className="relative bg-white w-full max-w-md rounded-t-[64px] p-8 pb-12 shadow-2xl animate-spring-up overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between mb-10 shrink-0 px-4 pt-4">
                 <div className="text-left">
                    <h2 className="text-[28px] font-black tracking-tight text-[#1C1917]">App Preferences</h2>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mt-1.5">Select your visual identity</p>
                 </div>
                 <button 
                  onClick={() => setShowThemePicker(false)} 
                  className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all border border-slate-100"
                 >
                   <X size={22} strokeWidth={3} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-x-5 gap-y-8 px-2 pb-8">
                 {themeOptions.map((opt) => (
                   <button 
                     key={opt.id}
                     onClick={() => { setTheme(opt.id); }}
                     className={`relative p-0 rounded-[44px] border-2 transition-all duration-500 flex flex-col items-center gap-4 active:scale-95 group overflow-visible ${theme === opt.id ? 'border-blue-500 scale-[1.02] shadow-xl shadow-blue-500/5' : 'border-slate-50 bg-white'}`}
                   >
                     {theme === opt.id && (
                       <div className="absolute -top-2 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg z-50 animate-heart-pop">
                          <VerifiedBadge size={14} />
                       </div>
                     )}

                     <div className="w-full aspect-[4/3] rounded-[40px] relative overflow-hidden flex flex-col shadow-sm border border-slate-50 bg-white" style={{ backgroundColor: opt.surface }}>
                        <div className="h-[28%] w-full" style={{ backgroundColor: opt.headerColor }} />
                        <div className="flex-1 flex items-center justify-center px-4">
                           <div className="w-full h-9 rounded-2xl shadow-sm flex items-center justify-center" style={{ backgroundColor: opt.buttonBg }}>
                              <span className="text-[8px] font-black uppercase tracking-[0.18em]" style={{ color: opt.buttonText }}>Order Now</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="text-center pb-2">
                        <p className="text-[14px] font-black leading-tight text-slate-900">{opt.label}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.15em] mt-1.5">Surface {opt.surface}</p>
                     </div>
                   </button>
                 ))}
              </div>
              
              <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-3 opacity-20 shrink-0">
                 <Sparkles size={16} className="text-blue-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.25em]">Premium Theme Ecosystem</span>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .animate-spring-up { animation: spring-up 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes spring-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};
