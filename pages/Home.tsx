
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, Star, Heart, SlidersHorizontal, 
  Plus, Bell, MapPin, ChevronDown, ArrowRight, Flame, 
  Sparkles, Zap, LayoutDashboard, UtensilsCrossed
} from 'lucide-react';
import { useApp } from '../App';
import { MenuItem } from '../types';

export const Home: React.FC = () => {
  const { 
    user, favorites, toggleFavorite, 
    featuredSlides, trendingItems, designConfig, unreadCount, categories,
    currentLocation
  } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const interactionTimer = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById('main-content');
    const onScroll = () => setIsScrolled((scrollContainer?.scrollTop || 0) > 20);
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollContainer?.removeEventListener('scroll', onScroll);
  }, []);

  // AUTO-SLIDE LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInteracting.current || !sliderRef.current) return;
      
      const nextIndex = (currentSlide + 1) % featuredSlides.length;
      const slideWidth = sliderRef.current.offsetWidth;
      
      sliderRef.current.scrollTo({
        left: nextIndex * slideWidth,
        behavior: 'smooth'
      });
      // currentSlide is updated by handleSlideScroll
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, featuredSlides.length]);

  const handleSlideScroll = () => {
    if (sliderRef.current) {
      const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth);
      if (index !== currentSlide) {
        setCurrentSlide(index);
      }
    }
  };

  const handleInteraction = () => {
    isInteracting.current = true;
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    
    interactionTimer.current = window.setTimeout(() => {
      isInteracting.current = false;
    }, 5000); // Resume auto-slide after 5 seconds of no interaction
  };

  const handleCategoryClick = (categoryName: string, event: React.MouseEvent) => {
    setActiveCategory(prev => prev === categoryName ? null : categoryName);
    if (navigator.vibrate) navigator.vibrate(10);
    const button = event.currentTarget as HTMLElement;
    const container = categoryScrollRef.current;
    if (container && button) {
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const filteredTrending = useMemo(() => {
    return trendingItems.filter(item => {
      const isEnabled = item.enabled;
      const isCategoryMatch = !activeCategory || item.category === activeCategory;
      return isEnabled && isCategoryMatch;
    });
  }, [trendingItems, activeCategory]);

  const locationDisplayText = useMemo(() => {
    if (!currentLocation.city) return "New York, USA";
    return `${currentLocation.city}, ${currentLocation.state}, ${currentLocation.country.toUpperCase()}`;
  }, [currentLocation]);

  return (
    <div className="min-h-screen pb-48 bg-white font-['Plus_Jakarta_Sans']">
      
      {/* 1. HEADER SECTION - Tightened spacing */}
      <header className={`fixed top-0 left-0 right-0 z-[1500] px-6 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate('/admin')}
              className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer active:scale-90 transition-transform"
            >
              <UtensilsCrossed className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">Location</span>
              <div 
                onClick={() => navigate('/manage-location')}
                className="flex items-center gap-1 mt-1 cursor-pointer active:opacity-60 transition-opacity"
              >
                <MapPin size={16} className="text-[#1C1C1E]" strokeWidth={3} />
                <span className="font-bold text-[15px] text-[#1C1C1E] tracking-tight">
                  {locationDisplayText}
                </span>
                <ChevronDown size={12} className="text-slate-400" strokeWidth={3} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center relative active:scale-95 transition-transform"
            >
               <LayoutDashboard size={18} className="text-[#1C1C1E]" strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center relative active:scale-95 transition-transform"
            >
               <Bell size={18} className="text-[#1C1C1E]" strokeWidth={2.5} />
               {unreadCount > 0 && (
                 <div className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
               )}
            </button>
          </div>
        </div>

        {/* 2. SEARCH BAR - Reduced top margin */}
        <div className="mt-3">
          <div 
            onClick={() => navigate('/search')}
            className="w-full h-12 bg-slate-50 rounded-full flex items-center px-5 gap-3 cursor-pointer active:bg-slate-100 transition-all border border-transparent"
          >
            <Search size={20} className="text-orange-500" strokeWidth={2.5} />
            <span className="text-[13px] font-medium text-slate-400">Search by Restaurants and Dishes...</span>
          </div>
        </div>
      </header>

      {/* CONTENT AREA WITH OPTIMIZED SPACING */}
      <div className="pt-[calc(env(safe-area-inset-top)+8.5rem)] px-6 space-y-5 animate-in fade-in duration-700">
        
        {/* 3. PROMO BANNER SECTION */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-black tracking-tight text-[#1C1C1E]">#SpecialForYou</h3>
          </div>
          <div 
            ref={sliderRef}
            onScroll={handleSlideScroll}
            onTouchStart={handleInteraction}
            onMouseDown={handleInteraction}
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 -mx-6 px-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {featuredSlides.map((slide) => (
              <div 
                key={slide.id}
                className="snap-center shrink-0 w-full aspect-[22/9.5] rounded-[24px] overflow-hidden relative shadow-md"
              >
                <img src={slide.img} className="absolute inset-0 w-full h-full object-cover" alt={slide.title} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent p-5 flex flex-col justify-center">
                   <div className="bg-white/10 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-full self-start mb-1.5 border border-white/20 uppercase tracking-widest">
                     {slide.badge}
                   </div>
                   <h3 className="text-white text-[19px] font-bold leading-tight tracking-tight mb-0.5 max-w-[170px]">
                     {slide.title}
                   </h3>
                   <div className="flex items-baseline gap-1 mb-2.5">
                      <span className="text-white text-[9px] font-bold uppercase opacity-70">Up to</span>
                      <span className="text-white text-2xl font-black tracking-tighter">40<span className="text-xs ml-0.5">%</span></span>
                   </div>
                   <button 
                    className="bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest self-start active:scale-95 transition-transform shadow-lg"
                   >
                     {slide.cta}
                   </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1 mt-2.5">
             {featuredSlides.map((_, i) => (
               <div key={i} className={`h-1 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-5 bg-orange-500' : 'w-1 bg-slate-200'}`} />
             ))}
          </div>
        </section>

        {/* 4. CATEGORIES SECTION */}
        <section className="pt-1">
           <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-black tracking-tight text-[#1C1C1E]">Categories</h3>
              <button 
                onClick={() => navigate('/search')} 
                className="text-[10px] font-black text-orange-500 uppercase tracking-widest" 
              >
                See All
              </button>
           </div>
           
           <div 
             ref={categoryScrollRef}
             className="flex overflow-x-auto no-scrollbar gap-4 -mx-6 px-6 snap-x pb-1"
           >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button 
                    key={cat.id}
                    onClick={(e) => handleCategoryClick(cat.name, e)}
                    className="snap-center shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div className={`
                      w-[68px] h-[68px] rounded-full overflow-hidden transition-all duration-300 border-[2px] p-0.5
                      ${isActive 
                        ? 'border-orange-500 scale-105 shadow-md shadow-orange-500/10 bg-white' 
                        : 'border-transparent bg-slate-50'
                      }
                    `}>
                       <img src={cat.icon} className="w-full h-full object-cover rounded-full" alt={cat.name} />
                    </div>
                    <span className={`text-[11px] font-black tracking-tight transition-colors ${isActive ? 'text-[#1C1C1E]' : 'text-slate-400'}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
           </div>
        </section>

        {/* 5. POPULAR DISHES SECTION */}
        <section className="pt-1 pb-10">
           <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-black tracking-tight text-[#1C1C1E]">Popular Dishes</h3>
              <button onClick={() => navigate('/search')} className="text-[10px] font-black text-orange-500 uppercase tracking-widest">See All</button>
           </div>
           
           <div key={activeCategory || 'all'} className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {filteredTrending.length > 0 ? filteredTrending.map((item) => {
                return (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(`/restaurant/res1`)}
                    className="bg-white rounded-[22px] overflow-hidden border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer group shadow-sm"
                  >
                    <div className="aspect-[1.25/1] relative overflow-hidden">
                       <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                       <div className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-slate-50">
                          <Star size={8} className="text-orange-500 fill-orange-500" />
                          <span className="text-[9px] font-black text-[#1C1C1E]">{item.rating}</span>
                       </div>
                    </div>
                    <div className="p-3 space-y-1">
                       <div className="flex items-center justify-between">
                         <h4 className="text-[13px] font-black text-[#1C1C1E] tracking-tight leading-tight">{item.name}</h4>
                         <div className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center rounded-sm shrink-0">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                         </div>
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-2 py-10 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No items found for this category</p>
                </div>
              )}
           </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
