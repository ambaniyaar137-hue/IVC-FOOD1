
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { User as UserIcon, Mail, Lock, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../App';
import { User } from '../types';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, theme } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const userData: User = { 
      uid: '123', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'user', 
      walletBalance: 100, 
      address: 'New User Address' 
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-8 animate-native-fade font-['Plus Jakarta Sans'] relative overflow-hidden">
      {/* Background Aura Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-[#1C1917] rounded-[24px] flex items-center justify-center shadow-2xl shadow-black/10 mb-6">
             <div className="w-8 h-8 border-[4px] border-[#FF4D00] rounded-full relative">
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                   <div className="w-1 h-2 bg-[#FF4D00] rounded-full" />
                   <div className="w-1 h-2 bg-[#FF4D00] rounded-full" />
                </div>
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[#1C1917]">Create account.</h1>
          <p className="text-slate-600 font-bold text-[11px] uppercase tracking-[0.2em] mt-2 leading-relaxed">Join the elite gourmet community</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3.5">
          <div className="relative group">
            <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D00] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[22px] pl-16 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[#FF4D00]/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917]"
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D00] transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[22px] pl-16 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[#FF4D00]/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917]"
              required
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D00] transition-colors" size={18} />
            <input 
              type="tel" 
              placeholder="Phone Number"
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[22px] pl-16 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[#FF4D00]/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917]"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D00] transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[22px] pl-16 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[#FF4D00]/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917]"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-[#FF4D00] text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? 'Registering...' : 'Get Started'}
            {!loading && <ArrowRight size={16} strokeWidth={3} />}
          </button>
        </form>

        <div className="text-center mt-10">
           <p className="text-slate-600 font-bold text-xs">
             Already a member? <Link to="/login" className="text-[#FF4D00] font-black border-b-2 border-[#FF4D00]/20 ml-1 pb-0.5">Sign In</Link>
           </p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-3 opacity-20">
           <Sparkles size={14} className="text-[#FF4D00]" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1C1917]">Secure Enterprise Platform</span>
        </div>
      </div>
    </div>
  );
};
