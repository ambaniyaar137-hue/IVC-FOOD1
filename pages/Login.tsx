
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { 
  Mail, Lock, ArrowRight, UserCircle, ShieldCheck, X, Check, 
  Loader2, ChevronRight, Sparkles, Unlock, LockIcon,
  Fingerprint, Power
} from 'lucide-react';
import { useApp } from '../App';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  // Fix: Removed isGuestLoginEnabled as it is not defined in AppContextType
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- ADMIN MASTER PIN STATES ---
  const [isAdminLockOpen, setIsAdminLockOpen] = useState(false);
  const [lockPhase, setLockPhase] = useState<'IDLE' | 'INPUT'>('IDLE');
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [isLockEnabled, setIsLockEnabled] = useState(true);
  const [pinError, setPinError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Mock Accounts for the Google Picker
  const googleAccounts = [
    { 
      uid: 'google-alex-001', 
      name: 'Alex Johnson', 
      email: 'alex@foodi.com', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' 
    },
    { 
      uid: 'google-explorer-id-001', 
      name: 'Google Explorer', 
      email: 'user@gmail.com', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google' 
    }
  ];

  // --- ADMIN PIN LOCK LOGIC ---
  const handleKeypadPress = (val: string) => {
    if (pinError) setPinError(false);
    const emptyIndex = pin.findIndex(v => v === '');
    if (emptyIndex !== -1) {
      const newPin = [...pin];
      newPin[emptyIndex] = val;
      setPin(newPin);
      
      // Auto-submit when 6th digit entered
      if (emptyIndex === 5) {
        verifyPin(newPin.join(''));
      }
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = [...pin].reverse().findIndex(v => v !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 5 - lastFilledIndex;
      const newPin = [...pin];
      newPin[actualIndex] = '';
      setPin(newPin);
    }
  };

  const verifyPin = async (enteredPin: string) => {
    setIsUnlocking(true);
    await new Promise(r => setTimeout(r, 1200));
    
    if (enteredPin === '123456') { // Master Admin PIN
      handleAdminLogin();
    } else {
      setPinError(true);
      setPin(['', '', '', '', '', '']);
      setIsUnlocking(false);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  const handleAdminLogin = () => {
    const adminData = {
      uid: 'admin-001',
      name: 'Master Admin',
      email: 'admin@foodi.com',
      role: 'admin' as const,
      walletBalance: 99999,
      address: 'Central Distribution Center'
    };
    
    const savedUsers = localStorage.getItem('simulated_users');
    let allUsers = savedUsers ? JSON.parse(savedUsers) : [];
    if (!allUsers.find((u: any) => u.uid === adminData.uid)) {
      allUsers.push(adminData);
      localStorage.setItem('simulated_users', JSON.stringify(allUsers));
    }

    setUser(adminData);
    localStorage.setItem('user', JSON.stringify(adminData));
    navigate('/admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const userData = { 
      uid: 'user-123', 
      name: 'John Doe', 
      email: email || 'alex@foodi.com', 
      role: 'user' as const,
      walletBalance: 634.99, 
      address: '746 Utica Ave, NY 11203' 
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoading(false);
    navigate('/');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const demoUser = { 
      uid: 'demo-user-777', 
      name: 'Demo Explorer', 
      email: 'demo@foodi.com', 
      role: 'user' as const,
      walletBalance: 1500.00, 
      address: 'Foodi Labs, NY 10001' 
    };
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
    setLoading(false);
    navigate('/');
  };

  const handleSelectGoogleAccount = (acc: typeof googleAccounts[0]) => {
    setLoading(true);
    setIsGooglePickerOpen(false);
    setTimeout(() => {
      const userData = { 
        uid: acc.uid, 
        name: acc.name, 
        email: acc.email, 
        role: 'user' as const,
        walletBalance: 250.00, 
        address: 'Current Location' 
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-8 animate-native-fade font-['Plus Jakarta Sans'] relative overflow-hidden">
      {/* Background Glows for Standard Login */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-sm:px-2 max-w-sm relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div 
            onClick={() => setIsAdminLockOpen(true)}
            className="w-16 h-16 bg-[#1C1917] rounded-[24px] flex items-center justify-center shadow-2xl shadow-black/10 mb-6 transform transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
             <div className="w-8 h-8 border-[4px] border-[#FF4D00] rounded-full relative group-hover:rotate-180 transition-transform duration-700">
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                   <div className="w-1 h-2 bg-[#FF4D00] rounded-full" />
                   <div className="w-1 h-2 bg-[#FF4D00] rounded-full" />
                </div>
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[#1C1917]">Welcome back.</h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-2">Sign in to your Foodi portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D00] transition-colors" size={18} />
              <input 
                type="email" 
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[22px] pl-16 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[#FF4D00]/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917]"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D00] transition-colors" size={18} />
              <input 
                type="password" 
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[22px] pl-16 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[#FF4D00]/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917]"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-[#1C1917] text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight size={16} strokeWidth={3} />}
          </button>
        </form>

        {/* --- SOCIAL & DEMO LOGIN --- */}
        <div className="mt-8 space-y-4">
           <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or connect via</span>
              <div className="h-[1px] flex-1 bg-slate-100" />
           </div>

           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsGooglePickerOpen(true)}
                className="h-14 bg-white border border-slate-100 rounded-[22px] flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-50 shadow-sm"
              >
                 <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                 </svg>
                 <span className="text-xs font-black text-[#1C1917] tracking-tight">Google</span>
              </button>

              <button 
                onClick={handleDemoLogin}
                className="h-14 bg-orange-50 border border-orange-100 rounded-[22px] flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-orange-100 shadow-sm group"
              >
                 <Sparkles size={18} className="text-orange-600 group-hover:rotate-12 transition-transform" />
                 <span className="text-xs font-black text-orange-600 tracking-tight">Demo Access</span>
              </button>
           </div>
        </div>

        <div className="text-center mt-10">
           <p className="text-slate-400 font-bold text-xs">
             New here? <Link to="/signup" className="text-[#FF4D00] font-black border-b-2 border-[#FF4D00]/20 ml-1 pb-0.5">Create Account</Link>
           </p>
        </div>
      </div>

      {/* --- GOOGLE ACCOUNT PICKER MODAL --- */}
      {isGooglePickerOpen && (
        <div className="fixed inset-0 z-[6000] flex flex-col items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={() => setIsGooglePickerOpen(false)} />
           <div className="relative bg-white w-full max-w-sm rounded-[44px] p-8 pb-10 shadow-2xl animate-native-up overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    <h2 className="text-lg font-black tracking-tight text-[#1C1917]">Choose account</h2>
                 </div>
                 <button onClick={() => setIsGooglePickerOpen(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 active:scale-90">
                    <X size={20} />
                 </button>
              </div>

              <div className="space-y-3">
                 {googleAccounts.map((acc) => (
                    <button 
                      key={acc.uid}
                      onClick={() => handleSelectGoogleAccount(acc)}
                      className="w-full flex items-center gap-4 p-4 rounded-[24px] bg-slate-50 border border-transparent hover:border-slate-100 active:scale-[0.98] transition-all group"
                    >
                       <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white shadow-sm flex-none">
                          <img src={acc.avatar} className="w-full h-full object-cover" alt={acc.name} />
                       </div>
                       <div className="text-left min-w-0">
                          <p className="text-[13px] font-black text-[#1C1917] truncate">{acc.name}</p>
                          <p className="text-[11px] font-bold text-slate-400 truncate">{acc.email}</p>
                       </div>
                       <ChevronRight size={16} className="ml-auto text-slate-200 group-hover:text-slate-400 transition-colors" />
                    </button>
                 ))}
                 <button className="w-full py-4 text-[11px] font-black uppercase tracking-widest text-[#4285F4] hover:bg-blue-50 rounded-2xl transition-all">
                    Use another account
                 </button>
              </div>

              <div className="mt-8 text-center px-4">
                 <p className="text-[9px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest">
                    To continue, Google will share your name, email address, language preference, and profile picture with Foodi.
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* --- FUTURISTIC DARK ADMIN PIN OVERLAY --- */}
      {isAdminLockOpen && (
        <div className="fixed inset-0 z-[7000] flex flex-col items-center justify-center bg-[#0B0F19] animate-in fade-in duration-500 overflow-hidden select-none">
           {/* Dynamic Background Blurs */}
           <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#FF6B2C]/10 blur-[120px] rounded-full animate-pulse-slow" />
           <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full animate-pulse-slow delay-700" />
           
           {/* Header Controls */}
           <div className="absolute top-[calc(env(safe-area-inset-top)+2rem)] left-0 right-0 px-8 flex items-center justify-between z-[6010]">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    <ShieldCheck className="text-[#FF6B2C]" size={20} strokeWidth={2.5} />
                 </div>
                 <div className="max-sm:hidden">
                    <h3 className="text-[#E5E7EB] font-black text-sm tracking-tight leading-none uppercase">Terminal Alpha</h3>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-1.5">Authorization Layer</p>
                 </div>
              </div>
              <button 
                onClick={() => { setIsAdminLockOpen(false); setPin(['','','','','','']); setLockPhase('IDLE'); }} 
                className="w-12 h-12 bg-white/5 text-[#E5E7EB] rounded-2xl flex items-center justify-center active:scale-90 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
           </div>

           <div className="w-full max-w-md px-10 flex flex-col items-center justify-center space-y-12 h-full relative z-20">
              
              {/* PHASE 1: UNLOCK SEQUENCE */}
              {lockPhase === 'IDLE' && (
                <div className="w-full text-center space-y-12 animate-in zoom-in-95 duration-500">
                   <div className="relative inline-block">
                      <div className="w-44 h-44 bg-white/[0.03] backdrop-blur-xl rounded-[64px] flex items-center justify-center border border-white/10 shadow-2xl relative group">
                         <div className={`absolute inset-0 bg-[#FF6B2C]/20 blur-[80px] rounded-full transition-opacity duration-1000 ${isLockEnabled ? 'opacity-100' : 'opacity-20'}`} />
                         <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                            {isLockEnabled ? (
                              <LockIcon size={72} className="text-[#E5E7EB] animate-pulse" strokeWidth={1.5} />
                            ) : (
                              <Unlock size={72} className="text-[#FF6B2C]" strokeWidth={1.5} />
                            )}
                         </div>
                      </div>
                      <div className="absolute -top-4 -right-4 bg-[#FF6B2C] p-4 rounded-2xl shadow-[0_10px_30px_rgba(255,107,44,0.4)] border-2 border-[#0B0F19] animate-bounce-slow">
                         <Fingerprint size={28} className="text-white" strokeWidth={2.5} />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-4xl font-black text-[#F9FAFB] tracking-tighter">Master Hub</h2>
                      <p className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-[0.25em] leading-relaxed max-w-[280px] mx-auto">
                        Cryptographic clearance required for root access.
                      </p>
                   </div>

                   {/* Protocol Toggle */}
                   <div className="bg-white/5 p-6 rounded-[36px] border border-white/10 flex items-center justify-between w-full max-w-[300px] mx-auto group hover:border-[#FF6B2C]/30 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isLockEnabled ? 'bg-[#FF6B2C]/20 text-[#FF6B2C]' : 'bg-white/10 text-[#9CA3AF]'}`}>
                            <Power size={18} strokeWidth={3} />
                         </div>
                         <div className="text-left">
                            <span className="block text-[10px] font-black uppercase text-white/80 tracking-widest">Protocol</span>
                            <span className="text-[9px] font-bold uppercase text-white/30 tracking-widest">{isLockEnabled ? 'Secured' : 'Bypass'}</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => setIsLockEnabled(!isLockEnabled)}
                        className={`w-14 h-8 rounded-full transition-all relative ${isLockEnabled ? 'bg-[#FF6B2C]' : 'bg-white/10 shadow-inner'}`}
                      >
                         <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-xl ${isLockEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                   </div>

                   <button 
                     onClick={() => setLockPhase('INPUT')}
                     className="w-full bg-[#E5E7EB] text-[#0B0F19] py-7 rounded-[36px] font-black text-[13px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                   >
                      Enter PIN <ArrowRight size={20} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              )}

              {/* PHASE 2: PIN INPUT SCREEN */}
              {lockPhase === 'INPUT' && (
                <div className="w-full space-y-12 animate-in slide-in-from-bottom-10 duration-500">
                   <div className="text-center space-y-3">
                      <p className="text-[#FF6B2C] font-black text-[11px] uppercase tracking-[0.4em] animate-pulse">Waiting for signature</p>
                      <h2 className="text-3xl font-black text-[#F9FAFB] tracking-tight">Enter 6-Digit PIN</h2>
                   </div>

                   {/* PIN DISPLAY BOXES */}
                   <div className={`flex justify-center gap-3.5 ${pinError ? 'animate-shake' : ''}`}>
                      {pin.map((digit, i) => (
                        <div key={i} className={`w-12 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                          digit !== '' ? 'border-[#FF6B2C] bg-[#FF6B2C]/10 scale-110 shadow-[0_0_25px_rgba(255,107,44,0.3)]' : 'border-white/10 bg-white/[0.03]'
                        } ${pinError ? 'border-[#FF4D4F] bg-[#FF4D4F]/10' : ''}`}>
                           {digit !== '' ? (
                             <div className="w-3 h-3 bg-[#F9FAFB] rounded-full animate-in zoom-in shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                           ) : (
                             <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                           )}
                        </div>
                      ))}
                   </div>

                   {/* NUMERIC KEYPAD */}
                   <div className="grid grid-cols-3 gap-x-5 gap-y-6 w-full max-w-[320px] mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'DEL'].map((val, idx) => (
                        val === '' ? <div key={idx} /> : (
                        <button 
                          key={val}
                          onClick={() => {
                            if (val === 'DEL') handleBackspace();
                            else handleKeypadPress(val.toString());
                          }}
                          className={`h-20 rounded-[32px] text-2xl font-black transition-all flex items-center justify-center border border-white/5 active:scale-90 shadow-sm ${
                            val === 'DEL' ? 'bg-[#FF4D4F]/10 text-[#FF4D4F] hover:bg-[#FF4D4F]/20' : 'bg-white/[0.03] text-[#E5E7EB] hover:bg-white/10 active:bg-[#FF6B2C] active:text-white'
                          }`}
                        >
                           {val === 'DEL' ? (
                             <X size={24} strokeWidth={3} />
                           ) : (
                             val
                           )}
                        </button>
                        )
                      ))}
                   </div>
                   
                   <div className="h-6 flex justify-center">
                     {pinError ? (
                        <p className="text-[#FF4D4F] text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-1">Access Denied • Try 123456</p>
                     ) : (
                        <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Master Override Enabled</p>
                     )}
                   </div>
                </div>
              )}
           </div>

           {/* Unlocking Blur Layer */}
           {isUnlocking && (
              <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-3xl z-[6100] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                 <div className="relative">
                    <Loader2 size={64} className="text-[#FF6B2C] animate-spin" strokeWidth={2} />
                    <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={24} strokeWidth={3} />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-[#F9FAFB] font-black text-xs uppercase tracking-[0.5em] animate-pulse">Syncing Hub Node...</p>
                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Decrypting Enterprise Protocol</p>
                 </div>
              </div>
           )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
