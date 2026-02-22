
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ChevronLeft, Clock, Check, 
  Phone, MapPin, X, 
  ShieldCheck, Star, PhoneCall,
  Settings, Save, RefreshCw,
  Send, MessageSquare, Briefcase, Home, Map as MapIcon, ChevronRight,
  Store, Utensils, Bike
} from 'lucide-react';
import { useApp } from '../App';

// Initial Mock Coordinates
const RESTAURANT_COORDS = { lat: 28.6139, lng: 77.2090, label: "The Signature Burger" };

type TrackingStage = 'PLACED' | 'PREPARING' | 'PICKED' | 'ON_THE_WAY' | 'RIDER_ASSIGNED' | 'ARRIVING' | 'DELIVERED';
type ChatMessage = { id: string; text: string; sender: 'user' | 'other'; timestamp: number };

declare const L: any; // Leaflet Global from index.html

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const OrderTracking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, designConfig, locations } = useApp();
  
  const [manualCoords, setManualCoords] = useState({ lat: 28.6250, lng: 77.2180 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistories, setChatHistories] = useState<Record<'rider' | 'restaurant', ChatMessage[]>>({
    rider: [
      { id: '1', text: "I'm heading to the restaurant now. I'll be there in 2 mins.", sender: 'other', timestamp: Date.now() - 120000 }
    ],
    restaurant: [
      { id: '1', text: "Your order is being prepared with extra care!", sender: 'other', timestamp: Date.now() - 300000 }
    ]
  });

  const [riderCoords, setRiderCoords] = useState({ lat: 28.6000, lng: 77.1900 });
  const [stage, setStage] = useState<TrackingStage>('PLACED');
  const [rotation, setRotation] = useState(0);

  const mapRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const customerMarkerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeContact, setActiveContact] = useState<'rider' | 'restaurant'>('rider');

  const dynamicETA = useMemo(() => {
    const kmDist = getDistanceFromLatLonInKm(riderCoords.lat, riderCoords.lng, manualCoords.lat, manualCoords.lng);
    const prepTime = (stage === 'PLACED' || stage === 'PREPARING') ? 10 : 0;
    const travelTimeMinutes = (kmDist * 210) / 60;
    const totalMinutes = Math.ceil(prepTime + travelTimeMinutes);
    if (stage === 'DELIVERED') return 0;
    return Math.max(totalMinutes, 1);
  }, [riderCoords, manualCoords, stage]);

  const orderStages: { key: TrackingStage, label: string }[] = [
    { key: 'PLACED', label: 'PLACED' },
    { key: 'PREPARING', label: 'PREPARING' },
    { key: 'PICKED', label: 'PICKED' },
    { key: 'ON_THE_WAY', label: 'ON WAY' },
    { key: 'RIDER_ASSIGNED', label: 'RI ASSI' }
  ];

  useEffect(() => {
    if (isChatOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, isChatOpen, activeContact]);

  useEffect(() => {
    if (!mapContainerRef.current || !(window as any).L) return;

    const timer = setTimeout(() => {
      if (mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([riderCoords.lat, riderCoords.lng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

      const restaurantIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="bg-white p-2.5 rounded-2xl shadow-xl border-2 border-orange-500 text-orange-500 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const customerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="bg-[#1C1917] p-2.5 rounded-2xl shadow-xl border-2 border-white text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const riderIcon = L.divIcon({
        className: 'custom-marker rider-marker-animated',
        html: `<div id="rider-marker-inner" class="bg-orange-500 p-3 rounded-full shadow-2xl border-4 border-white text-white transition-transform duration-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="2.5"/><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="15" cy="5" r="1"/><path d="M12 13h4l2 2"/><path d="M12 13V7l4 2-4 2Z"/><path d="m12 13-1-4h3l1 4Z"/><path d="M18 15h-1l-1.5-4.5H12 L10 15H8"/></svg></div>`,
        iconSize: [54, 54],
        iconAnchor: [27, 27]
      });

      L.marker([RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng], { icon: restaurantIcon }).addTo(map);
      customerMarkerRef.current = L.marker([manualCoords.lat, manualCoords.lng], { icon: customerIcon }).addTo(map);
      riderMarkerRef.current = L.marker([riderCoords.lat, riderCoords.lng], { icon: riderIcon }).addTo(map);

      mapRef.current = map;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const stream = setInterval(() => {
      setRiderCoords(prev => {
        const isHeadingToResto = stage === 'PLACED' || stage === 'PREPARING';
        const target = isHeadingToResto ? RESTAURANT_COORDS : manualCoords;
        const dLat = target.lat - prev.lat;
        const dLng = target.lng - prev.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        if (dist < 0.0008) {
          if (stage === 'PLACED') setStage('PREPARING');
          else if (stage === 'PREPARING') setTimeout(() => setStage('PICKED'), 2000);
          else if (stage === 'PICKED') setStage('ON_THE_WAY');
          else if (stage === 'ON_THE_WAY') setStage('RIDER_ASSIGNED');
          return prev;
        }

        const step = 0.035;
        const nextLat = prev.lat + dLat * step;
        const nextLng = prev.lng + dLng * step;
        setRotation(Math.atan2(dLng, dLat) * (180 / Math.PI));
        return { lat: nextLat, lng: nextLng };
      });
    }, 2500);
    return () => clearInterval(stream);
  }, [stage, manualCoords]);

  useEffect(() => {
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng([riderCoords.lat, riderCoords.lng]);
      const el = document.getElementById('rider-marker-inner');
      if (el) el.style.transform = `rotate(${rotation - 90}deg)`;
    }
  }, [riderCoords, rotation]);

  const handleSendChat = () => {
    if (!chatMsg.trim()) return;
    const newUserMsg: ChatMessage = { id: Date.now().toString(), text: chatMsg, sender: 'user', timestamp: Date.now() };
    setChatHistories(prev => ({ ...prev, [activeContact]: [...prev[activeContact], newUserMsg] }));
    setChatMsg('');
    setTimeout(() => {
      const otherMsg: ChatMessage = { id: (Date.now() + 1).toString(), text: "On it!", sender: 'other', timestamp: Date.now() };
      setChatHistories(prev => ({ ...prev, [activeContact]: [...prev[activeContact], otherMsg] }));
    }, 1500);
  };

  const contactData = {
    rider: {
      name: 'Ravi Kumar',
      role: 'TOP RIDER',
      rating: '4.9',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi',
      phone: '9876543210'
    },
    restaurant: {
      name: 'The Signature Burger',
      role: 'RESTAURANT',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400',
      phone: '1800-444-FOOD'
    }
  };

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-12 px-6 bg-[#FF4D00] shadow-lg rounded-b-[60px] text-white">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center active:scale-90 transition-all border border-white/10">
            <ChevronLeft size={24} strokeWidth={4} />
          </button>
          <div className="text-center">
            <h2 className="text-[22px] font-black tracking-tighter leading-none mb-2">Track Order</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 leading-none">
                {dynamicETA} MINS TO FEAST
              </p>
            </div>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center active:scale-90 border border-white/10">
            <Settings size={22} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* MAP AREA */}
      <div className="flex-1 relative mt-[calc(env(safe-area-inset-top)+6rem)]">
        <div ref={mapContainerRef} id="map-container" className="absolute inset-0 z-10" />
      </div>

      {/* BOTTOM PANEL */}
      <div className="absolute bottom-0 left-0 right-0 z-[100] p-0 pointer-events-none">
        <div className="bg-white rounded-t-[64px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-slate-50 p-10 pt-12 space-y-8 pointer-events-auto animate-native-up">
          
          {/* TRACKING PROGRESS */}
          <div className="relative mb-4">
             <div className="absolute top-[16px] left-[12%] right-[12%] h-[3px] bg-slate-100 rounded-full" />
             <div className="flex justify-between items-center px-4">
                {orderStages.map((s, idx) => {
                  const currentIdx = orderStages.findIndex(os => os.key === stage);
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={s.key} className="flex flex-col items-center gap-4 flex-none w-14">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${
                         isDone ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'bg-slate-50 text-slate-300'
                       }`}>
                         {isDone ? <Check size={16} strokeWidth={4} /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                       </div>
                       <span className={`text-[8px] font-black uppercase tracking-[0.1em] text-center transition-colors ${isDone ? 'text-slate-900' : 'text-slate-300'}`}>{s.label}</span>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* CONTACT SWITCHER - SLIDING PILL UI */}
          <div className="relative bg-slate-50 p-1.5 rounded-[28px] flex items-center shadow-inner border border-slate-100/50">
             {/* Animated Sliding Background */}
             <div 
               className="absolute top-1.5 bottom-1.5 left-1.5 rounded-[22px] bg-[#1C1917] shadow-xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
               style={{ 
                 width: 'calc(50% - 3px)',
                 transform: `translateX(${activeContact === 'rider' ? '0%' : '100%'})`
               }}
             />
             
             <button 
              onClick={() => setActiveContact('rider')}
              className={`relative z-10 flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 flex items-center justify-center gap-2.5 ${activeContact === 'rider' ? 'text-white' : 'text-slate-400'}`}
             >
                <Bike size={16} strokeWidth={2.5} /> Delivery
             </button>
             <button 
              onClick={() => setActiveContact('restaurant')}
              className={`relative z-10 flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 flex items-center justify-center gap-2.5 ${activeContact === 'restaurant' ? 'text-white' : 'text-slate-400'}`}
             >
                <Store size={16} strokeWidth={2.5} /> Restaurant
             </button>
          </div>

          {/* DYNAMIC CONTACT CARD - SLIDE FADE ANIMATION */}
          <div className="relative h-[110px]">
            {Object.entries(contactData).map(([key, data]) => (
              <div 
                key={key}
                className={`absolute inset-0 bg-[#151311] rounded-[44px] p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] flex items-center justify-between ${
                  activeContact === key 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/10 rounded-[24px] overflow-hidden p-0.5 border border-white/5 shadow-inner">
                     <div className="w-full h-full rounded-[20px] bg-white overflow-hidden p-0.5">
                        <img src={data.image} className="w-full h-full object-cover" alt={key} />
                     </div>
                  </div>
                  <div>
                    <h4 className="text-[18px] font-black text-white tracking-tight leading-tight">{data.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                       <Star size={12} fill="#FF4D00" strokeWidth={0} />
                       <p className="text-[10px] font-bold text-white uppercase tracking-widest">{data.rating} • {data.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.location.href = `tel:${data.phone}`}
                    className="w-14 h-14 bg-[#10B981] text-white rounded-[24px] flex items-center justify-center active:scale-90 transition-all shadow-lg hover:shadow-emerald-500/20"
                  >
                    <PhoneCall size={24} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="w-14 h-14 bg-white text-[#1C1917] rounded-[24px] flex items-center justify-center active:scale-90 transition-all shadow-lg"
                  >
                    <MessageSquare size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRACKING SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[60px] p-10 pb-14 shadow-2xl animate-native-up flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[#1C1917] tracking-tight">Order Settings</h2>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Manage delivery details</p>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-90"><X size={20} strokeWidth={3} /></button>
             </div>
             
             <div className="space-y-4">
                <button 
                  onClick={() => { setIsSettingsOpen(false); navigate('/profile/locations'); }}
                  className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500">
                      <MapPin size={22} strokeWidth={3} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-[15px] text-[#1C1917]">Change Address</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update delivery point</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-orange-500 transition-colors" strokeWidth={4} />
                </button>

                <button 
                  onClick={() => { setIsSettingsOpen(false); setIsChatOpen(true); }}
                  className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                      <MessageSquare size={22} strokeWidth={3} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-[15px] text-[#1C1917]">Contact Support</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chat with an agent</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" strokeWidth={4} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* CHAT OVERLAY */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setIsChatOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-[80vh] rounded-t-[64px] flex flex-col shadow-2xl animate-native-up">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shadow-inner ${activeContact === 'rider' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                     {activeContact === 'rider' ? <Bike size={28} strokeWidth={3} /> : <Store size={28} strokeWidth={3} />}
                  </div>
                  <div>
                     <h3 className="font-black text-xl text-slate-900 tracking-tight">Chat with {activeContact === 'rider' ? 'Rider' : 'Outlet'}</h3>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> ONLINE
                     </p>
                  </div>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all"><X size={24} /></button>
            </div>
            
            <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-6">
              {chatHistories[activeContact].map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-6 rounded-[32px] max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-[#1C1917] text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}>
                      <p className="text-[15px] font-bold leading-relaxed">{msg.text}</p>
                   </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-10 bg-white border-t border-slate-50 flex gap-4">
               <input 
                 value={chatMsg}
                 onChange={(e) => setChatMsg(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                 placeholder="Message..." 
                 className="flex-1 bg-slate-50 border border-slate-100 rounded-[28px] px-8 py-5 text-sm font-bold outline-none focus:bg-white transition-all shadow-inner"
               />
               <button onClick={handleSendChat} className="w-16 h-16 bg-[#1C1917] text-white rounded-[24px] flex items-center justify-center shadow-xl active:scale-95 transition-all"><Send size={22} strokeWidth={3} /></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-native-up { animation: up 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-marker { background: none; border: none; transition: all 2.5s linear; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .leaflet-marker-icon.rider-marker-animated { transition: transform 2.5s linear, opacity 0.3s ease; }
      `}</style>
    </div>
  );
};
