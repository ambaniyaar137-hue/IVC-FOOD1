
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, MapPin, CreditCard, Banknote, 
  CheckCircle2, ArrowRight, X, 
  RefreshCw, Home, Briefcase, Map as MapIcon,
  AlertCircle, Wallet as WalletIcon, ArrowUpRight,
  Navigation, Search
} from 'lucide-react';
import { useApp } from '../App';
import { WalletTransactionCategory } from '../types';

export const Checkout: React.FC = () => {
  const { cart, user, clearCart, appliedPromo, locations, isWalletEnabled, processTransaction, designConfig } = useApp();
  const navigate = useNavigate();
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'WALLET' | 'ONLINE'>('COD');
  const [isPlacing, setIsPlacing] = useState(false);
  
  // Delivery State
  const defaultLoc = locations.find(l => l.isDefault) || locations[0];
  const [selectedAddress, setSelectedAddress] = useState(defaultLoc?.address || user?.address || 'Set Delivery Address');
  const [selectedLabel, setSelectedLabel] = useState(defaultLoc?.label || 'Other');

  // Modal State
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showWalletError, setShowWalletError] = useState(false);
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  
  const [locationMode, setLocationMode] = useState<'saved' | 'auto' | 'manual'>('saved');
  const [manualAddr, setManualAddr] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 50.00;
  const discount = appliedPromo ? (subtotal * appliedPromo.percentage) / 100 : 0;
  const total = subtotal + deliveryFee - discount;

  const handlePlaceOrder = async () => {
    if (selectedAddress === 'Set Delivery Address') {
      setShowLocationPopup(true);
      return;
    }

    setIsPlacing(true);

    if (paymentMethod === 'WALLET') {
      const orderId = 'ORD' + Math.floor(Math.random() * 100000);
      const res = await processTransaction({
        amount: total,
        type: 'debit',
        category: WalletTransactionCategory.ORDER_PAYMENT,
        description: `Order Payment for ${orderId}`,
        orderId
      });

      if (!res.success) {
        setWalletErrorMessage(res.message);
        setShowWalletError(true);
        setIsPlacing(false);
        return;
      }
    }

    await new Promise(r => setTimeout(r, 1500));
    const finalOrderId = 'ORD' + Math.floor(Math.random() * 100000);
    clearCart();
    navigate(`/orders/${finalOrderId}`, { state: { justPlaced: true } });
  };

  const handleConfirmLocation = (address: string, label: string) => {
    setSelectedAddress(address);
    setSelectedLabel(label as 'Home' | 'Work' | 'Other');
    setShowLocationPopup(false);
  };

  const simulateGps = async () => {
    setIsLocating(true);
    setDetectedAddress(null);
    await new Promise(r => setTimeout(r, 2000));
    setDetectedAddress('42 Broadway, Financial District, New York, NY 10004');
    setIsLocating(false);
  };

  useEffect(() => {
    if (locationMode === 'auto' && !detectedAddress && !isLocating) {
      simulateGps();
    }
  }, [locationMode]);

  const paymentMethods = useMemo(() => [
    { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay at your doorstep' },
    ...(isWalletEnabled ? [{ id: 'WALLET', label: 'Virtual Wallet', icon: CreditCard, desc: `₹${user?.walletBalance?.toFixed(2) || '0.00'} Available` }] : []),
    { id: 'ONLINE', label: 'Credit / UPI', icon: CreditCard, desc: 'Instant & Secure' },
  ], [isWalletEnabled, user]);

  return (
    <div className="pb-44 pt-safe-standard px-5 animate-native-up relative">
      <div className="flex items-center gap-5 mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-4 bg-white rounded-[22px] shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center justify-center text-[#1C1917]"
        >
          <ChevronLeft strokeWidth={4} size={20} />
        </button>
        <div>
           <h1 className="text-2xl font-black tracking-tighter text-[#1C1917]">Checkout</h1>
           <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Review & Pay</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Delivery Address Card */}
        <section className="bg-white rounded-[32px] p-7 border border-slate-100 shadow-sm group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Deliver to</h2>
            <button 
              onClick={() => setShowLocationPopup(true)}
              className="text-orange-600 text-[9px] font-black uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100/50 active:scale-95 transition-all"
            >
              Change
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,77,0,0.2)] border-2 border-white flex-none">
              {selectedLabel === 'Home' ? <Home size={22} strokeWidth={3} /> : selectedLabel === 'Work' ? <Briefcase size={22} strokeWidth={3} /> : <MapPin size={22} strokeWidth={3} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[16px] text-[#1C1917] tracking-tight">
                {selectedLabel}
              </p>
              <p className="text-[12px] text-slate-400 font-medium leading-relaxed mt-0.5 line-clamp-1">
                {selectedAddress}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="bg-white rounded-[32px] p-7 border border-slate-100 shadow-sm">
          <h2 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 mb-8">Payment Options</h2>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div 
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`flex items-center justify-between p-4 rounded-[24px] cursor-pointer border-2 transition-all duration-300 ${
                  paymentMethod === method.id 
                  ? 'border-orange-500 bg-orange-50/20 shadow-lg shadow-orange-500/5' 
                  : 'border-slate-50 bg-slate-50/40 hover:border-orange-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${paymentMethod === method.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
                    <method.icon size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-black text-[14px] text-[#1C1917] tracking-tight leading-tight">{method.label}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${paymentMethod === method.id ? 'text-orange-600' : 'text-slate-300'}`}>{method.desc}</p>
                  </div>
                </div>
                {paymentMethod === method.id && (
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in-50">
                    <CheckCircle2 size={16} strokeWidth={4} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 z-[2100] bg-white pb-safe shadow-[0_-15px_50px_rgba(0,0,0,0.06)] border-t border-slate-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em] mb-1">TOTAL DUE</p>
            <p className="text-3xl font-black text-[#1C1917] tracking-tighter">₹{total.toFixed(2)}</p>
          </div>
          <button 
            disabled={isPlacing}
            onClick={handlePlaceOrder}
            className="flex-1 bg-[#1C1917] text-white py-5 rounded-[22px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 h-[64px]"
          >
            {isPlacing ? 'Processing...' : 'Place Order'}
            {!isPlacing && <ArrowRight size={18} strokeWidth={4} />}
          </button>
        </div>
      </div>

      {/* REFINED LOCATION MODAL MATCHING REFERENCE IMAGE */}
      {showLocationPopup && (
        <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowLocationPopup(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[56px] p-10 pb-14 shadow-2xl animate-native-up overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div>
                <h2 className="text-[28px] font-black tracking-tight text-[#1C1917]">Select Location</h2>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">WHERE SHOULD WE DELIVER?</p>
              </div>
              <button 
                onClick={() => setShowLocationPopup(false)} 
                className="w-12 h-12 bg-[#F1F5F9] text-slate-900 rounded-[20px] flex items-center justify-center active:scale-90 transition-all shadow-sm"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* TAB SWITCHER UI - EXACT MATCH TO REF IMAGE */}
            <div className="bg-[#F8FAFC] p-2 rounded-[28px] flex items-center mb-8 shrink-0 shadow-inner border border-slate-100/50">
              <button 
                onClick={() => setLocationMode('saved')} 
                className={`flex-1 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  locationMode === 'saved' 
                    ? 'bg-[#1C1917] text-white shadow-xl shadow-black/10 border-2 border-white/10 ring-2 ring-black/5' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                SAVED
              </button>
              <button 
                onClick={() => setLocationMode('auto')} 
                className={`flex-1 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  locationMode === 'auto' 
                    ? 'bg-[#1C1917] text-white shadow-xl shadow-black/10 border-2 border-white/10 ring-2 ring-black/5' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                AUTO GPS
              </button>
              <button 
                onClick={() => setLocationMode('manual')} 
                className={`flex-1 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  locationMode === 'manual' 
                    ? 'bg-[#1C1917] text-white shadow-xl shadow-black/10 border-2 border-white/10 ring-2 ring-black/5' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                MANUAL
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 min-h-[300px]">
              {locationMode === 'saved' && (
                <div className="space-y-4 animate-native-fade">
                  {locations.map(loc => (
                    <div 
                      key={loc.id}
                      onClick={() => handleConfirmLocation(loc.address, loc.label)}
                      className="flex items-center justify-between p-6 rounded-[32px] bg-slate-50 border border-slate-100 active:scale-[0.98] transition-all cursor-pointer group hover:border-orange-200"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-slate-400 group-hover:text-orange-500 shadow-sm transition-colors border border-slate-100">
                          {loc.label === 'Home' ? <Home size={22} /> : loc.label === 'Work' ? <Briefcase size={22} /> : <MapIcon size={22} />}
                        </div>
                        <div>
                          <p className="font-black text-[16px] text-[#1C1917] tracking-tight">{loc.label}</p>
                          <p className="text-[11px] font-bold text-slate-400 truncate max-w-[200px] mt-0.5">{loc.address}</p>
                        </div>
                      </div>
                      <ChevronLeft size={20} className="rotate-180 text-slate-300" strokeWidth={4} />
                    </div>
                  ))}
                  {locations.length === 0 && (
                    <div className="text-center py-12 px-8">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                         <MapPin size={32} className="text-slate-200" />
                       </div>
                       <p className="text-sm font-bold text-slate-400">No saved locations found. Use Manual or GPS to add one.</p>
                    </div>
                  )}
                </div>
              )}

              {locationMode === 'auto' && (
                <div className="space-y-8 animate-native-fade py-6 text-center">
                  {isLocating ? (
                    <div className="flex flex-col items-center gap-6">
                       <div className="relative">
                          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center animate-pulse">
                            <Navigation size={40} className="text-orange-500" />
                          </div>
                          <div className="absolute inset-0 w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-[#1C1917]">Acquiring Signal</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Connecting to GPS Satellites...</p>
                       </div>
                    </div>
                  ) : detectedAddress ? (
                    <div className="space-y-8">
                       <div className="p-8 bg-emerald-50 rounded-[44px] border border-emerald-100 relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-emerald-900 group-hover:scale-110 transition-transform">
                             <MapIcon size={120} />
                          </div>
                          <div className="relative z-10 flex flex-col items-center">
                             <div className="w-16 h-16 bg-white rounded-[22px] flex items-center justify-center text-emerald-500 shadow-sm mb-6 border border-emerald-100">
                                <CheckCircle2 size={32} strokeWidth={3} />
                             </div>
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Current Location Detected</p>
                             <p className="text-[15px] font-black text-emerald-900 leading-relaxed px-4">{detectedAddress}</p>
                          </div>
                       </div>
                       <button 
                        onClick={() => handleConfirmLocation(detectedAddress, 'Other')}
                        className="w-full bg-[#1C1917] text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                       >
                          Use this location
                       </button>
                       <button 
                        onClick={simulateGps}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mx-auto active:opacity-50"
                       >
                          <RefreshCw size={14} strokeWidth={3} /> Retry Location
                       </button>
                    </div>
                  ) : null}
                </div>
              )}

              {locationMode === 'manual' && (
                <div className="space-y-6 animate-native-fade pt-2">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Delivery Address</label>
                    <div className="relative group">
                       <Search size={18} className="absolute left-6 top-6 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                       <textarea 
                        autoFocus
                        value={manualAddr}
                        onChange={(e) => setManualAddr(e.target.value)}
                        placeholder="House no., Building name, Landmark, Street info..."
                        className="w-full h-40 bg-slate-50 border border-slate-100 rounded-[36px] py-6 pl-16 pr-8 text-sm font-bold text-[#1C1917] outline-none focus:bg-white focus:border-orange-200 transition-all shadow-inner leading-relaxed"
                       />
                    </div>
                  </div>
                  <button 
                    disabled={manualAddr.length < 10}
                    onClick={() => handleConfirmLocation(manualAddr, 'Other')}
                    className="w-full bg-[#1C1917] text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Confirm Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showWalletError && (
        <div className="fixed inset-0 z-[4000] flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl animate-fade-in" onClick={() => setShowWalletError(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[48px] p-10 pb-12 shadow-2xl animate-native-up text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center border border-rose-100 shadow-inner">
                <WalletIcon size={40} className="text-rose-500 animate-pulse" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg text-white">
                <AlertCircle size={20} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-[#1C1917] tracking-tight">Insufficient Balance</h2>
              <p className="text-slate-400 text-xs font-bold leading-relaxed px-2">
                Your wallet balance (₹{user?.walletBalance?.toFixed(2)}) is lower than the order total.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/profile/wallet')}
                className="w-full bg-[#1C1917] text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Top Up Now <ArrowUpRight size={16} strokeWidth={4} />
              </button>
              <button 
                onClick={() => setShowWalletError(false)}
                className="w-full bg-slate-50 text-slate-400 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] border border-slate-100 active:scale-95 transition-all"
              >
                Change Method
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-native-up { animation: up 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-native-fade { animation: fade 0.4s ease-out; }
        @keyframes fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
