
import React, { useState } from 'react';
// useNavigate is a core routing hook from react-router.
import { useNavigate } from 'react-router';
import { ChevronLeft, ShieldCheck, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const [consent, setConsent] = useState(true);

  return (
    <div className="pb-40 animate-spring-up pt-safe-premium px-6">
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3.5 bg-orange-50 text-orange-600 rounded-2xl shadow-md border border-orange-100 active:scale-90 transition-all flex items-center justify-center"
        >
          <ChevronLeft strokeWidth={4} size={22} />
        </button>
        <div>
           <h1 className="text-3xl font-black tracking-tighter text-[#1C1917]">Privacy</h1>
           <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1 opacity-60">Legal & Data</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-black/5 p-8 shadow-sm space-y-8 mb-8">
         <div className="flex items-center gap-4 text-orange-600">
            <ShieldCheck size={28} strokeWidth={2.5} />
            <h2 className="text-xl font-black tracking-tight text-[#1C1917]">Your data is secure</h2>
         </div>
         
         <div className="space-y-6 text-sm font-medium text-slate-500 leading-relaxed">
            <p>At Foodi, we are committed to protecting your privacy. We use your data exclusively to improve your gourmet experience.</p>
            
            <section className="space-y-3">
               <h3 className="font-black text-[#1C1917] uppercase text-[10px] tracking-widest">1. Data Collection</h3>
               <p className="text-[13px]">We collect your location, order history, and contact details to facilitate fast and secure deliveries.</p>
            </section>

            <section className="space-y-3">
               <h3 className="font-black text-[#1C1917] uppercase text-[10px] tracking-widest">2. Security</h3>
               <p className="text-[13px]">All payment information is tokenized and stored in encrypted vaults via our secure financial partners.</p>
            </section>
         </div>

         <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
            <div>
               <p className="text-[11px] font-black text-[#1C1917] uppercase tracking-widest">Personalization</p>
               <p className="text-[9px] font-bold text-slate-400 mt-1">Allow tracking for better suggestions</p>
            </div>
            <button 
              onClick={() => setConsent(!consent)}
              className={`w-14 h-8 rounded-full transition-all relative ${consent ? 'bg-orange-600' : 'bg-slate-200'}`}
            >
               <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${consent ? 'left-7' : 'left-1'}`} />
            </button>
         </div>
      </div>

      <div className="space-y-4">
         <button className="w-full p-6 rounded-[32px] border border-black/5 bg-white flex items-center justify-between active:scale-95 transition-all group">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
                  <Download size={20} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-widest text-[#1C1917]">Download My Data</span>
            </div>
            <ChevronLeft size={16} className="rotate-180 opacity-20" />
         </button>

         <button className="w-full p-6 rounded-[32px] border border-rose-50 bg-rose-50/30 flex items-center justify-between active:scale-95 transition-all group">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                  <Trash2 size={20} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-widest text-rose-500">Delete Account</span>
            </div>
            <AlertCircle size={16} className="text-rose-300" />
         </button>
      </div>
      
      <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mt-12 mb-8">Version 3.4.1 Build 2209</p>
    </div>
  );
};
