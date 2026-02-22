
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, Plus, Trash2, Home, Briefcase, 
  Map as MapIcon, Check, MapPin, Navigation, 
  Loader2, Sparkles, X
} from 'lucide-react';
import { useApp, Location } from '../App';

export const SavedLocations: React.FC = () => {
  const navigate = useNavigate();
  const { locations, removeLocation, setDefaultLocation, addLocation, designConfig } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddress, setNewAddress] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleAdd = () => {
    if (!newAddress.trim()) return;
    addLocation({
      id: Math.random().toString(36).substr(2, 9),
      label: newLabel,
      address: newAddress.trim(),
      isDefault: locations.length === 0
    });
    setNewAddress('');
    setShowAddModal(false);
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          // In a real app, you'd reverse geocode the lat/long here.
          // For this demo, we simulate the logic.
          await new Promise(r => setTimeout(r, 1500));
          const mockAddress = "42, Signature Towers, Financial District, New York";
          setNewAddress(mockAddress);
          setIsDetecting(false);
        }, (error) => {
          console.error("Error detecting location:", error);
          setIsDetecting(false);
          alert("Could not detect location. Please type manually.");
        });
      } else {
        setIsDetecting(false);
        alert("Geolocation not supported.");
      }
    } catch (e) {
      setIsDetecting(false);
    }
  };

  return (
    <div className="pb-40 pt-safe-premium px-6 min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--brand-bg)' }}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white text-slate-900 rounded-[18px] shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center justify-center"
          >
            <ChevronLeft strokeWidth={4} size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-[#1C1917]">Managed Addresses</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Delivery Destinations</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 text-white rounded-[18px] flex items-center justify-center shadow-xl active:scale-90 transition-transform"
          style={{ backgroundColor: designConfig.primaryColor }}
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* LOCATIONS LIST */}
      <div className="space-y-4">
        {locations.map(loc => (
          <div 
            key={loc.id} 
            onClick={() => setDefaultLocation(loc.id)}
            className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer group relative overflow-hidden ${loc.isDefault ? 'bg-white border-orange-500 shadow-lg shadow-orange-500/5' : 'bg-white/60 border-slate-50'}`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${loc.isDefault ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                  {loc.label === 'Home' ? <Home size={22} strokeWidth={2.5} /> : loc.label === 'Work' ? <Briefcase size={22} strokeWidth={2.5} /> : <MapIcon size={22} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-black tracking-tight text-[#1C1917]">{loc.label}</h3>
                    {loc.isDefault && (
                      <div className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg border border-orange-100 flex items-center gap-1">
                        <Check size={8} strokeWidth={4} />
                        <span className="text-[8px] font-black uppercase tracking-widest leading-none">Default</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 mt-1.5 leading-relaxed truncate max-w-[180px]">{loc.address}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); removeLocation(loc.id); }}
                className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-100 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} strokeWidth={3} />
              </button>
            </div>
            
            {loc.isDefault && (
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <MapPin size={80} />
              </div>
            )}
          </div>
        ))}

        {locations.length === 0 && (
          <div className="py-24 text-center space-y-6">
             <div className="w-24 h-24 bg-white rounded-[40px] border border-slate-50 flex items-center justify-center mx-auto text-slate-100 shadow-sm">
                <MapIcon size={40} />
             </div>
             <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No addresses saved yet</p>
          </div>
        )}
      </div>

      {/* NEW ADDRESS MODAL - REFINED AS PER REFERENCE IMAGE */}
      {showAddModal && (
        <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-md animate-fade-in" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[56px] p-8 pb-12 shadow-2xl animate-native-up overflow-hidden">
            
            {/* Grabber */}
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" />

            <div className="flex flex-col items-center mb-8">
               <h2 className="text-[28px] font-black tracking-tight text-[#1C1917] text-center">New Address</h2>
            </div>

            {/* Category Tabs Section */}
            <div className="flex bg-slate-50 p-2 rounded-[28px] mb-8 border border-slate-100 shadow-inner">
              {(['Home', 'Work', 'Other'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setNewLabel(l)}
                  className={`flex-1 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                    newLabel === l 
                      ? 'bg-[#FF6A00] text-white shadow-xl shadow-orange-500/20 scale-100' 
                      : 'text-slate-400 hover:text-slate-600 scale-95'
                  }`}
                  style={{ backgroundColor: newLabel === l ? designConfig.primaryColor : undefined }}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Address Field Section */}
            <div className="space-y-4 mb-10">
               <div className="relative group">
                  <textarea 
                    autoFocus
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter full address details..." 
                    className="w-full h-40 bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-[15px] font-bold outline-none focus:bg-white focus:border-orange-200 transition-all text-[#1C1917] shadow-inner leading-relaxed resize-none placeholder:text-slate-300"
                  />
                  
                  {/* Pin Location Auto Button */}
                  <button 
                    onClick={detectLocation}
                    disabled={isDetecting}
                    className="absolute right-6 bottom-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 active:scale-90 transition-all group"
                  >
                    {isDetecting ? (
                      <Loader2 size={20} className="text-orange-500 animate-spin" />
                    ) : (
                      <Navigation size={20} className="text-orange-500 group-hover:scale-110 transition-transform" strokeWidth={3} />
                    )}
                  </button>
               </div>
               
               <div className="flex items-center gap-3 px-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Auto-detect location for pin-point accuracy</p>
               </div>
            </div>

            {/* Main Action Button */}
            <button 
              disabled={!newAddress.trim() || isDetecting}
              onClick={handleAdd}
              className="w-full bg-[#1C1917] text-white py-6 rounded-[32px] font-bold text-[14px] uppercase tracking-[0.15em] shadow-2xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isDetecting ? 'Detecting Location...' : 'ADD LOCATION'}
              {!isDetecting && <Sparkles size={16} className="text-orange-400" />}
            </button>
            
            {/* Secondary Dismiss Button */}
            <button 
              onClick={() => setShowAddModal(false)}
              className="mt-6 w-full py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] active:opacity-50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      <style>{`
        .animate-native-up { animation: up 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
