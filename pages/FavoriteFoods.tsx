
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Heart, Plus, Sparkles, Check } from 'lucide-react';
import { useApp } from '../App';

export const FavoriteFoods: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart, designConfig } = useApp();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(item);
    setAddingId(item.id);
    setTimeout(() => setAddingId(null), 1500);
  };

  return (
    <div className="pb-40 pt-safe-premium px-6 min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--brand-bg)' }}>
      <div className="flex items-center gap-6 mb-12">
        <button onClick={() => navigate(-1)} className="p-3.5 bg-white text-slate-900 rounded-2xl shadow-md border border-slate-100 active:scale-90 flex items-center justify-center" style={{ color: designConfig.primaryColor }}>
          <ChevronLeft strokeWidth={4} size={22} />
        </button>
        <div>
           <h1 className="text-3xl font-black tracking-tighter text-[#1C1917]">Favorites</h1>
           <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60" style={{ color: designConfig.primaryColor }}>Personalized for you</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {favorites.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-[40px] border border-black/5 shadow-sm flex gap-5 items-center">
              <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-md flex-none">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-black text-[#1C1917] truncate">{item.name}</h3>
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(item); }} className="p-1 active:scale-125">
                    <Heart size={18} fill={designConfig.primaryColor} style={{ color: designConfig.primaryColor }} strokeWidth={0} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                   <p className="text-lg font-black tracking-tighter" style={{ color: designConfig.primaryColor }}>₹{item.price.toFixed(2)}</p>
                   <button onClick={(e) => handleAddClick(e, item)} disabled={addingId === item.id} className="px-5 py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-100" style={{ backgroundColor: addingId === item.id ? '#10B981' : designConfig.primaryColor }}>
                     {addingId === item.id ? <Check size={14} strokeWidth={4} /> : <><Plus size={14} strokeWidth={4} /> Add</>}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-8">
           <div className="w-40 h-40 bg-white rounded-[56px] flex items-center justify-center relative shadow-sm border border-slate-50">
              <Heart size={80} style={{ color: `${designConfig.primaryColor}22`, fill: `${designConfig.primaryColor}11` }} />
              <div className="absolute top-4 right-4 animate-pulse"><Sparkles style={{ color: designConfig.primaryColor }} size={24} /></div>
           </div>
           <div><h3 className="text-2xl font-black text-[#1C1917]">No Favorites Yet</h3></div>
           <button onClick={() => navigate('/')} className="text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95" style={{ backgroundColor: designConfig.primaryColor }}>Browse Menu</button>
        </div>
      )}
    </div>
  );
};
