
import React, { useState } from 'react';
// useNavigate is a core routing hook from react-router.
import { useNavigate } from 'react-router';
import { Search as SearchIcon, ChevronLeft, X, History, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../App';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState(['Pizza', 'Biryani', 'Burger King', 'Healthy Salads']);

  const handleSearch = (q: string) => {
    setQuery(q);
  };

  const trending = [
    { name: 'Healthy Diet', color: 'rgba(34, 197, 94, 0.1)', textColor: '#22C55E' },
    { name: 'Best Pizzas', color: 'rgba(255, 77, 0, 0.1)', textColor: '#FF4D00' },
    { name: 'Midnight Snacks', color: 'rgba(107, 33, 168, 0.1)', textColor: '#6B21A8' },
    { name: 'Breakfast Deals', color: 'rgba(234, 179, 8, 0.1)', textColor: '#EAB308' }
  ];

  return (
    <div className="space-y-8 animate-slide-down pt-safe-premium pb-32">
      {/* Header & Input - Fixed Visibility for Back Button */}
      <div className="flex items-center gap-4 px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3.5 bg-orange-50 text-[var(--brand-primary)] rounded-2xl shadow-md border border-orange-100 active:scale-90 transition-all flex items-center justify-center"
        >
          <ChevronLeft strokeWidth={4} size={22} />
        </button>
        <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-[24px] border border-black/5 transition-all duration-300 group bg-white shadow-xl shadow-slate-200/20 focus-within:border-orange-200">
          <SearchIcon size={20} className="text-orange-500 group-focus-within:text-orange-600 transition-colors" strokeWidth={3} />
          <input 
            autoFocus
            type="text" 
            placeholder="Search food or restaurants..." 
            className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:text-slate-300 text-[#1C1917]"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <X size={16} className="text-slate-500" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {!query && (
        <div className="space-y-10 px-6">
          {/* Recent History - High Visibility Pills */}
          <section>
            <div className="flex justify-between items-center mb-6 px-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <History size={16} strokeWidth={3} className="text-orange-500" />
                Recent Activity
              </h2>
              <button 
                onClick={() => setHistory([])} 
                className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-all"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {history.map(item => (
                <button 
                  key={item}
                  onClick={() => handleSearch(item)}
                  className={`
                    px-5 py-3 rounded-2xl text-[11px] font-black tracking-tight transition-all border
                    ${item === 'Healthy Salads' 
                      ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-orange-500/30 active:scale-95' 
                      : 'bg-white text-[var(--brand-primary)] border-orange-100/60 hover:border-orange-200 hover:bg-orange-50 active:scale-95 shadow-sm'
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* Trending */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 mb-6 px-1">
              <TrendingUp size={16} strokeWidth={3} className="text-emerald-500" />
              Trending Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trending.map(item => (
                <div 
                  key={item.name}
                  onClick={() => handleSearch(item.name)}
                  className="p-5 rounded-3xl flex items-center justify-between border cursor-pointer active:scale-95 transition-all group bg-white border-black/5 shadow-sm hover:shadow-lg hover:border-orange-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-inner" style={{ backgroundColor: item.color, color: item.textColor }}>
                      {item.name[0]}
                    </div>
                    <span className="font-extrabold text-[15px] tracking-tight text-[#1C1917]">{item.name}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-orange-50">
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {query && (
        <div className="space-y-6 px-6">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Found Results for "{query}"</p>
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <div 
                key={i}
                onClick={() => navigate('/restaurant/res1')}
                className="p-5 rounded-[32px] flex gap-5 border cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 group bg-white border-black/5 shadow-sm"
              >
                <div className="w-24 h-24 rounded-[24px] overflow-hidden flex-none shadow-md">
                  <img src={`https://picsum.photos/400/400?random=${i + 50}`} className="w-full h-full object-cover" alt="Result" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-black text-lg tracking-tight text-[#1C1917]">Premium Kitchen {i}</h3>
                  <p className="text-xs font-bold mt-1 uppercase tracking-tighter text-slate-400">Italian • Fast Food • 20 mins</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={12} className="fill-orange-500 text-orange-500" />
                    <span className="text-[10px] font-black">4.5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
