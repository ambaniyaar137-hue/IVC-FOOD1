
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { 
  ChevronLeft, Star, Clock, ShoppingBag, Plus, Minus, 
  Heart, ArrowRight, Check, MapPin, Search, Filter, 
  BellRing, Droplets, IndianRupee, Sparkles, MessageCircle, MoreVertical
} from 'lucide-react';
import { useApp } from '../App';
import { MenuItem, Outlet } from '../types';

export const RestaurantDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, updateQuantity, cart, toggleFavorite, favorites, diningSession, designConfig } = useApp();
  
  const isTableMode = diningSession && diningSession.restaurantId === id;
  const [loading, setLoading] = useState(true);
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Signature');

  // Dining Actions States
  const [activeRequest, setActiveRequest] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 600));
      setOutlet({ 
        id: id!, 
        name: 'The Signature Burger', 
        locationName: 'Downtown Hub',
        cuisine: ['Gourmet', 'Fast Food'], 
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800', 
        rating: 4.8, 
        prepTime: 15, 
        address: '746 Utica Ave, NY 11203', 
        approved: true, 
        isOpen: true 
      });
      setMenuItems([
        { id: 'm1', outletId: id!, name: 'Double Cheese Burger', description: 'Juicy beef patty, topped with melted cheese, fresh lettuce, tomato, pickles, and our special sauce.', price: 150.00, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400', stock: 10, available: true, category: 'Signature', isVeg: false, rating: 4.9, prepTime: 12 },
        { id: 'm2', outletId: id!, name: 'Crispy Truffle Fries', description: 'Hand-cut fries tossed in white truffle oil and parmesan.', price: 65.50, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400', stock: 15, available: true, category: 'Sides', isVeg: true, rating: 4.7, prepTime: 8 },
        { id: 'm3', outletId: id!, name: 'Thick Vanilla Shake', description: 'Real bean vanilla ice cream blended with farm fresh milk.', price: 50.00, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400', stock: 50, available: true, category: 'Drinks', isVeg: true, rating: 4.6, prepTime: 5 },
      ]);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ ...item, quantity: 1 });
    setAddingId(item.id);
    setTimeout(() => setAddingId(null), 1500);
  };

  const handleServiceRequest = (type: string) => {
    setActiveRequest(type);
    setTimeout(() => setActiveRequest(null), 3000);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return (
    <div className="p-10 space-y-10 animate-pulse pt-safe-premium bg-white min-h-screen">
      <div className="h-72 rounded-[60px] bg-slate-50" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 bg-slate-50 rounded-2xl" />
        <div className="h-4 w-1/3 bg-slate-50 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-8">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-[32px]" />)}
      </div>
    </div>
  );

  return (
    <div className="pb-48 bg-[#F8FAFC] min-h-screen font-['Inter'] relative select-none">
      
      {/* 1. Cinematic Header Section */}
      <div className="relative h-[440px] overflow-hidden">
        <img src={outlet?.imageUrl} alt={outlet?.name} className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-black/20 to-transparent" />
        
        {/* Navigation Layer */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+2rem)] left-0 right-0 px-6 flex justify-between z-50">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl">
            <ChevronLeft size={24} strokeWidth={4} />
          </button>
          
          {isTableMode && (
            <div className="bg-orange-500/90 backdrop-blur-xl px-5 py-3 rounded-[24px] border border-orange-400/30 flex items-center gap-3 shadow-2xl shadow-orange-500/20 animate-in slide-in-from-top-4">
               <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
               <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Table #12 Active</span>
            </div>
          )}
          
          <button className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-2xl flex items-center justify-center active:scale-90 shadow-xl">
            <Search size={22} strokeWidth={3} />
          </button>
        </div>

        {/* Brand Info Overlay */}
        <div className="absolute bottom-20 left-8 right-8 text-white">
          <div className="flex items-center gap-2.5 mb-5 animate-in slide-in-from-left-4 duration-700">
             <div className="bg-[#FF4D00] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                <Star size={14} fill="white" strokeWidth={0} />
                <span className="font-black text-[13px]">{outlet?.rating}</span>
             </div>
             <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                <Clock size={14} className="text-white" />
                <span className="font-black text-[10px] uppercase tracking-widest">{outlet?.prepTime} MINS</span>
             </div>
          </div>
          <h1 className="text-[44px] font-black tracking-tighter leading-[0.95] mb-4">{outlet?.name}</h1>
          <div className="flex items-center gap-2 opacity-60">
             <MapPin size={12} strokeWidth={3} />
             <p className="text-xs font-bold uppercase tracking-[0.2em]">{outlet?.address}</p>
          </div>
        </div>
      </div>

      {/* 2. Menu Experience Container */}
      <div className="relative -mt-16 bg-[#F8FAFC] rounded-t-[64px] min-h-[600px] shadow-[0_-40px_80px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="w-14 h-1.5 bg-slate-200 rounded-full mx-auto mt-10 mb-10" />

        {/* Sticky Category Tabs */}
        <div className="sticky top-0 z-[1000] bg-[#F8FAFC]/90 backdrop-blur-2xl border-b border-slate-100 px-6 py-6 mb-8 flex gap-3 overflow-x-auto no-scrollbar">
           {['Signature', 'Sides', 'Drinks', 'Desserts'].map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`flex-none px-6 py-3.5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeCategory === cat ? 'bg-[#1C1917] text-white shadow-xl scale-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-orange-200'}`}
             >
                {cat}
             </button>
           ))}
        </div>

        {/* Dining Hub Actions (Only for Table Mode) */}
        {isTableMode && (
          <div className="px-6 mb-12 animate-in fade-in duration-1000">
             <div className="bg-white rounded-[44px] p-8 border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                   <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Dining Hub</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live from Table #12</p>
                   </div>
                   <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                      <Sparkles size={24} strokeWidth={2.5} />
                   </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                   <button 
                    onClick={() => handleServiceRequest('Waiter')}
                    className={`p-6 rounded-[32px] flex flex-col items-center gap-3 transition-all border-2 ${activeRequest === 'Waiter' ? 'bg-orange-500 border-orange-500 text-white shadow-xl scale-95' : 'bg-slate-50 border-slate-50 text-slate-500 active:bg-orange-50 active:border-orange-100 active:text-orange-500'}`}
                   >
                      {activeRequest === 'Waiter' ? <Check size={22} strokeWidth={4} /> : <BellRing size={22} strokeWidth={3} />}
                      <span className="text-[8px] font-black uppercase tracking-widest">Call Waiter</span>
                   </button>

                   <button 
                    onClick={() => handleServiceRequest('Water')}
                    className={`p-6 rounded-[32px] flex flex-col items-center gap-3 transition-all border-2 ${activeRequest === 'Water' ? 'bg-blue-500 border-blue-500 text-white shadow-xl scale-95' : 'bg-slate-50 border-slate-50 text-slate-500 active:bg-blue-50 active:border-blue-100 active:text-blue-500'}`}
                   >
                      {activeRequest === 'Water' ? <Check size={22} strokeWidth={4} /> : <Droplets size={22} strokeWidth={3} />}
                      <span className="text-[8px] font-black uppercase tracking-widest">Refill Water</span>
                   </button>

                   <button 
                    onClick={() => navigate('/cart')}
                    className="p-6 rounded-[32px] bg-slate-50 border-2 border-slate-50 flex flex-col items-center gap-3 text-slate-500 active:bg-emerald-50 active:border-emerald-100 active:text-emerald-500 transition-all"
                   >
                      <IndianRupee size={22} strokeWidth={3} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Request Bill</span>
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="px-6 space-y-16 pb-20">
          {[activeCategory].map(category => {
            const items = menuItems.filter(i => i.category === category);
            return (
              <section key={category} className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-10 px-2">
                   <div className="flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(255,106,0,0.5)]" />
                      <h2 className="text-3xl font-black tracking-tighter text-[#1C1917]">{category}</h2>
                   </div>
                   <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 active:scale-90 transition-all">
                      <Filter size={18} />
                   </button>
                </div>
                
                <div className="space-y-12">
                  {items.map(item => {
                    const cartItem = cart.find(ci => ci.id === item.id);
                    return (
                      <div key={item.id} className="flex gap-8 group">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               {item.isVeg ? (
                                 <div className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center rounded-sm">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                 </div>
                               ) : (
                                 <div className="w-4 h-4 border-2 border-rose-500 flex items-center justify-center rounded-sm">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                 </div>
                               )}
                               <h3 className="text-xl font-black tracking-tight text-[#1C1917]">{item.name}</h3>
                            </div>
                            <button onClick={() => toggleFavorite(item)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-50 active:scale-125 transition-all">
                               <Heart size={16} className={favorites.some(f => f.id === item.id) ? 'text-orange-500 fill-orange-500' : 'text-slate-200'} />
                            </button>
                          </div>
                          
                          <p className="text-[13px] text-slate-400 font-medium leading-relaxed line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center gap-6 pt-2">
                             <span className="text-2xl font-black text-orange-600 tracking-tighter">₹{item.price.toFixed(2)}</span>
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-slate-400">
                                <Clock size={12} strokeWidth={3} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{item.prepTime}m</span>
                             </div>
                          </div>
                        </div>
                        
                        <div className="relative w-36 h-36 flex-none">
                          <div className="w-full h-full rounded-[44px] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500">
                             <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                             {item.available && (
                               <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                  <span className="text-[10px] font-black">{item.rating}</span>
                               </div>
                             )}
                          </div>
                          
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28">
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-[#1C1917] text-white p-2.5 rounded-[22px] shadow-2xl font-black border-[3px] border-white active:scale-95 transition-all">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-2 active:scale-75"><Minus size={16} strokeWidth={4} /></button>
                                <span className="text-[16px]">{cartItem.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-2 active:scale-75"><Plus size={16} strokeWidth={4} /></button>
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => handleAddToCart(e, item)}
                                disabled={addingId === item.id}
                                className={`w-full py-4 rounded-[22px] text-[11px] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em] border-[3px] border-white ${
                                  addingId === item.id ? 'bg-emerald-500 text-white' : 'bg-orange-600 text-white'
                                }`}
                              >
                                {addingId === item.id ? <Check size={18} strokeWidth={4} className="mx-auto" /> : 'ADD'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Persistent Basket Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-[112px] left-6 right-6 z-[1600] animate-in slide-in-from-bottom-10 duration-700">
          <button 
            onClick={() => navigate('/cart')}
            className="w-full flex items-center justify-between bg-orange-600 text-white p-6 rounded-[36px] shadow-[0_25px_60px_rgba(255,106,0,0.35)] active:scale-95 transition-all border-[5px] border-white relative overflow-hidden"
          >
            {/* Animated Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-[22px] flex items-center justify-center border border-white/30 backdrop-blur-md">
                  <ShoppingBag size={26} strokeWidth={3} />
                </div>
                <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] w-7 h-7 flex items-center justify-center rounded-full font-black border-2 border-orange-600 shadow-xl">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80 mb-1">TABLE BASKET</span>
                <span className="text-2xl font-black tracking-tighter leading-none">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
               <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Review</span>
               <ArrowRight size={22} strokeWidth={4} />
            </div>
          </button>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
