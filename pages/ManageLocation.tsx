
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, MapPin, Check, Info, Loader2, Sparkles 
} from 'lucide-react';
import { useApp } from '../App';
import { DeliveryAddress } from '../types';

export const ManageLocation: React.FC = () => {
  const { currentLocation, setCurrentLocation, designConfig } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState<DeliveryAddress>({ ...currentLocation });
  const [loading, setLoading] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock ZIP Database for auto-fill convenience
  const zipDatabase: Record<string, { city: string; state: string; country: string }> = {
    "141001": { city: "Ludhiana", state: "Punjab", country: "India" },
    "141016": { city: "Ludhiana", state: "Punjab", country: "India" },
    "110001": { city: "New Delhi", state: "Delhi", country: "India" },
    "400001": { city: "Mumbai", state: "Maharashtra", country: "India" },
    "10001": { city: "New York", state: "NY", country: "USA" },
    "11203": { city: "Brooklyn", state: "NY", country: "USA" }
  };

  const performLookup = useCallback((zip: string) => {
    if (!zip) return;
    setIsLookingUp(true);
    
    // Simulate lookup delay
    setTimeout(() => {
      if (zipDatabase[zip]) {
        const data = zipDatabase[zip];
        setForm(prev => ({
          ...prev,
          city: data.city,
          state: data.state,
          country: data.country
        }));
        setError(null);
      }
      setIsLookingUp(false);
    }, 500);
  }, []);

  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Digits only
    if (val.length > 6) return;
    
    handleChange('zipCode', val);
    
    if (val.length >= 5) {
      performLookup(val);
    }
  };

  const handleSave = async () => {
    if (!form.fullAddress.trim()) {
      setError("Full address is required.");
      return;
    }
    if (!form.zipCode.trim()) {
      setError("ZIP/PIN code is required.");
      return;
    }
    if (!form.city.trim() || !form.state.trim() || !form.country.trim()) {
      setError("City, State, and Country are required.");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    setCurrentLocation(form);
    setLoading(false);
    setSuccess(true);

    if (navigator.vibrate) navigator.vibrate(20);
    setTimeout(() => navigate('/'), 1500);
  };

  const inputClasses = "w-full bg-white border border-slate-100 rounded-[22px] py-4 px-6 text-[14px] font-bold outline-none focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all text-[#1C1917] shadow-sm placeholder:text-slate-300";

  return (
    <div className="min-h-screen pb-40 pt-safe-premium px-6 bg-[#F8FAFC] font-['Plus_Jakarta_Sans'] select-none overflow-y-auto">
      <header className="flex items-center gap-6 mb-10 animate-in slide-in-from-top-4 duration-700">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 bg-white text-slate-900 rounded-[18px] shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center justify-center"
        >
          <ChevronLeft strokeWidth={4} size={22} />
        </button>
        <div>
           <h1 className="text-[26px] font-black tracking-tighter text-[#1C1917] leading-none">Manage Location</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Delivery Settings</p>
        </div>
      </header>

      {/* Current Active Location Card */}
      <section className="bg-white rounded-[32px] p-7 border border-slate-100 shadow-sm mb-8 animate-in fade-in duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        <div className="flex items-center gap-4 mb-3 relative z-10">
           <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <MapPin size={20} strokeWidth={3} />
           </div>
           <h2 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Current Saved Point</h2>
        </div>
        <div className="ml-14 relative z-10">
          <p className="font-black text-[17px] text-[#1C1917] tracking-tight">
            {currentLocation.city}, {currentLocation.state}, {currentLocation.country.toUpperCase()}
          </p>
          <p className="text-[12px] text-slate-400 font-medium leading-relaxed mt-1 opacity-60 line-clamp-1">
            {currentLocation.fullAddress} {currentLocation.apartment ? `• ${currentLocation.apartment}` : ''}
          </p>
        </div>
      </section>

      {/* Address Form */}
      <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-700">
         <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Address *</label>
            <textarea 
              value={form.fullAddress}
              onChange={(e) => handleChange('fullAddress', e.target.value)}
              placeholder="Building, Street, Landmark"
              className={`${inputClasses} h-24 resize-none leading-relaxed pt-4`}
            />
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Apartment / Flat No.</label>
            <input 
              type="text"
              value={form.apartment || ''}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="e.g. Flat 402"
              className={inputClasses}
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">ZIP / PIN Code *</label>
               <div className="relative">
                  <input 
                    type="tel"
                    value={form.zipCode}
                    onChange={handleZipChange}
                    placeholder="e.g. 141001"
                    className={inputClasses}
                  />
                  {isLookingUp && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <Loader2 size={16} className="animate-spin text-orange-500" />
                    </div>
                  )}
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City *</label>
               <input 
                 type="text"
                 value={form.city}
                 onChange={(e) => handleChange('city', e.target.value)}
                 placeholder="Enter City"
                 className={inputClasses}
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">State *</label>
               <input 
                 type="text"
                 value={form.state}
                 onChange={(e) => handleChange('state', e.target.value)}
                 placeholder="Enter State"
                 className={inputClasses}
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Country *</label>
               <input 
                 type="text"
                 value={form.country}
                 onChange={(e) => handleChange('country', e.target.value)}
                 placeholder="Enter Country"
                 className={inputClasses}
               />
            </div>
         </div>

         {error && (
            <div className="flex items-start gap-2 text-rose-500 px-4 py-3 bg-rose-50 rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-left-2">
               <Info size={14} strokeWidth={3} className="mt-0.5 shrink-0" />
               <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
         )}

         <div className="pt-6">
            <button 
              onClick={handleSave}
              disabled={loading || success}
              className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 text-white disabled:opacity-50 ${success ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-[#1C1917]'}`}
              style={{ backgroundColor: !success ? designConfig.primaryColor : undefined }}
            >
               {loading ? (
                 <>Updating... <Loader2 size={18} className="animate-spin" /></>
               ) : success ? (
                 <>Success <Check size={18} strokeWidth={4} /></>
               ) : (
                 <>Save Location <Sparkles size={16} className="text-orange-400" /></>
               )}
            </button>
         </div>
      </div>

      <style>{`
        .animate-native-up { animation: up 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
