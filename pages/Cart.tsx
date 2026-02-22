
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, Plus, Minus, Trash2, ArrowRight, 
  Tag, ShoppingBag, IndianRupee, ShieldCheck, X, 
  Check, Utensils, Bike, MessageSquare, Info, 
  ChevronDown, Users, Coins, CreditCard, Sparkles
} from 'lucide-react';
import { useApp } from '../App';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, appliedPromo, setAppliedPromo, diningSession, designConfig } = useApp();
  const navigate = useNavigate();
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  
  // Table-Specific States
  const [splitCount, setSplitCount] = useState(1);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [instruction, setInstruction] = useState('');

  const isTableMode = !!diningSession;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = appliedPromo ? (subtotal * appliedPromo.percentage) / 100 : 0;
  const tax = subtotal * 0.05; // 5% GST
  const serviceCharge = isTableMode ? subtotal * 0.1 : 0; // 10% Service for tables
  const tipAmount = subtotal * (tipPercentage / 100);
  const total = subtotal + tax + serviceCharge + tipAmount - discount;
  const splitTotal = total / splitCount;

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (code === 'WELCOME') {
      setAppliedPromo({ code: 'WELCOME', percentage: 50, description: '50% First Order Discount' });
      setIsPromoModalOpen(false);
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-10 animate-native-up bg-[#F8FAFC]">
        <div className="w-56 h-56 bg-white rounded-[64px] flex items-center justify-center mb-12 shadow-inner border border-slate-50">
           <ShoppingBag size={80} className="text-slate-100" strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-4 text-slate-900">Basket is empty</h2>
        <p className="text-slate-400 text-lg font-medium mb-12 max-w-[280px]">Add some gourmet signatures to start your dining session.</p>
        <button onClick={() => navigate('/')} className="w-full max-w-[280px] bg-orange-600 text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="pb-48 pt-safe-standard px-6 bg-[#F8FAFC] min-h-screen font-['Inter'] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 relative z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-14 h-14 bg-white text-slate-900 rounded-[24px] shadow-sm border border-slate-100 active:scale-90 flex items-center justify-center">
            <ChevronLeft strokeWidth={4} size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">Review Basket</h1>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em] mt-1">{isTableMode ? `Dining at Table #12` : `${cart.length} Signature Items`}</p>
          </div>
        </div>
        {isTableMode && (
          <div className="w-14 h-14 bg-[#1C1917] rounded-[24px] flex items-center justify-center text-white shadow-xl">
             <Utensils size={24} strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="space-y-8 pb-10">
        {/* Item List */}
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 p-6 bg-white rounded-[40px] border border-slate-50 shadow-sm items-center group relative overflow-hidden">
              <div className="w-24 h-24 rounded-[28px] overflow-hidden flex-none border-2 border-slate-50">
                 <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[17px] font-black tracking-tight text-slate-900 leading-tight pr-6">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-200 p-2 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 bg-white rounded-lg shadow-sm active:scale-75 transition-all text-orange-600"><Minus size={14} strokeWidth={4} /></button>
                      <span className="text-[16px] font-black text-slate-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 bg-white rounded-lg shadow-sm active:scale-75 transition-all text-orange-600"><Plus size={14} strokeWidth={4} /></button>
                   </div>
                   <span className="text-[20px] font-black text-slate-900 tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE SERVICE FEATURES */}
        {isTableMode && (
          <section className="space-y-8">
             {/* Split Bill UI */}
             <div className="bg-white p-8 rounded-[44px] border border-slate-50 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Users className="text-orange-500" size={20} strokeWidth={3} />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Split Bill</h3>
                   </div>
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center active:scale-90 transition-all"><Minus size={16} /></button>
                      <span className="text-lg font-black text-slate-900">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center active:scale-90 transition-all"><Plus size={16} /></button>
                   </div>
                </div>
                {splitCount > 1 && (
                  <div className="p-5 bg-orange-50 rounded-[28px] flex items-center justify-between border border-orange-100/50 animate-in zoom-in duration-300">
                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">₹{splitTotal.toFixed(2)} per person</span>
                     <Users size={16} className="text-orange-300" />
                  </div>
                )}
             </div>

             {/* Tipping Section */}
             <div className="bg-white p-8 rounded-[44px] border border-slate-50 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Coins className="text-emerald-500" size={20} strokeWidth={3} />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Appreciate Service</h3>
                   </div>
                   <span className="text-[15px] font-black text-emerald-600">₹{tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                   {[0, 5, 10, 15, 20].map(p => (
                     <button 
                       key={p} 
                       onClick={() => setTipPercentage(p)}
                       className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black transition-all ${tipPercentage === p ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                     >
                       {p === 0 ? 'NONE' : `${p}%`}
                     </button>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* Special Instructions */}
        <div className="bg-[#F1F5F9] p-2 rounded-[32px] border border-slate-200/50">
           <textarea 
             placeholder="Cooking instructions (e.g. Medium rare, No onions...)"
             value={instruction}
             onChange={(e) => setInstruction(e.target.value)}
             className="w-full bg-white border border-transparent rounded-[28px] p-6 text-[14px] font-bold outline-none focus:border-orange-200 transition-all shadow-inner leading-relaxed resize-none h-32"
           />
        </div>

        {/* Bill Summary - Re-engineered for Table Mode */}
        <div className="bg-[#1C1917] rounded-[56px] p-10 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 blur-[80px] rounded-full" />
           
           <div className="flex items-center gap-3 text-white">
              <IndianRupee size={20} strokeWidth={3} className="text-white/30" />
              <h4 className="text-[14px] font-black uppercase tracking-[0.3em]">Session Summary</h4>
           </div>

           <div className="space-y-5">
              <div className="flex justify-between items-center text-white/50 text-sm font-bold">
                 <span>Items Subtotal</span>
                 <span className="text-white font-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-white/50 text-sm font-bold">
                 <span>GST (5%)</span>
                 <span className="text-white font-black">₹{tax.toFixed(2)}</span>
              </div>
              {isTableMode && (
                <div className="flex justify-between items-center text-white/50 text-sm font-bold">
                   <span>Service Charge (10%)</span>
                   <span className="text-white font-black">₹{serviceCharge.toFixed(2)}</span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 text-sm font-bold">
                   <span>Appreciation Tip</span>
                   <span className="font-black">₹{tipAmount.toFixed(2)}</span>
                </div>
              )}
              {appliedPromo && (
                <div className="flex justify-between items-center text-orange-400 text-sm font-bold">
                   <span>Promo: {appliedPromo.code}</span>
                   <span className="font-black">-₹{discount.toFixed(2)}</span>
                </div>
              )}
           </div>

           <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
              <div className="flex items-end justify-between">
                 <div className="space-y-1">
                    <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em]">Total Payable</p>
                    <h2 className="text-5xl font-black tracking-tighter text-white">₹{total.toFixed(2)}</h2>
                 </div>
                 {isTableMode && (
                   <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                      <Sparkles size={12} className="text-orange-500" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">In-Dine Session</span>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => navigate('/checkout')}
                  className="bg-orange-600 text-white h-20 rounded-[28px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    Checkout <ArrowRight size={20} strokeWidth={4} />
                 </button>
                 <button 
                  className="bg-white/5 text-white/40 h-20 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 active:bg-white/10 transition-all flex items-center justify-center gap-3"
                 >
                    <Users size={18} /> Split Pay
                 </button>
              </div>
           </div>
        </div>

        {/* Safety Badge */}
        <div className="flex flex-col items-center gap-4 py-8 opacity-20">
           <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Encrypted Session</span>
           </div>
           <p className="text-[9px] font-bold uppercase tracking-widest max-w-[200px] text-center leading-relaxed">Session Token: {diningSession?.sessionToken || 'GUEST-UNAUTH'}</p>
        </div>
      </div>

      <style>{`
        .animate-native-up { animation: up 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
