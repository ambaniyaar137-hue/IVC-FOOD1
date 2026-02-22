
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../App';

interface WelcomeProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Fast Delivery of Delicious Food",
    subtitle: "Order food within minutes and get exclusive bonuses at your doorstep.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1200",
    button: "Next"
  },
  {
    id: 2,
    title: "Exclusive Offers & Daily Discounts",
    subtitle: "Unlock premium rewards and save big on your favorite gourmet cuisines.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200",
    button: "Get Started"
  }
];

export const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { designConfig } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => timer && clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
      navigate('/');
    }
  };

  const currentData = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[1000] bg-[#000000] overflow-hidden flex flex-col items-center justify-center font-['Inter']">
      {/* Background Layer with Crossfade */}
      <div className="absolute inset-0 z-0">
        {ONBOARDING_STEPS.map((step, index) => (
          <img 
            key={step.id}
            src={step.image} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentStep === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} 
            alt={`Step ${index + 1}`} 
          />
        ))}
        {/* Adjusted gradient for better image visibility while keeping text clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className={`relative z-10 w-full h-full flex flex-col justify-between p-8 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Top Branding Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Logo without the white background box as requested */}
             <div className="w-16 h-16 flex items-center justify-center transition-transform hover:scale-110 duration-500">
                <img src={designConfig.logoUrl} className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" alt="Foodi Logo" />
             </div>
             <span className="text-white text-3xl font-black tracking-tighter drop-shadow-xl">Foodi</span>
          </div>
          {currentStep < ONBOARDING_STEPS.length - 1 && (
            <button 
              onClick={() => { onComplete(); navigate('/'); }}
              className="text-white/60 text-[12px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Skip
            </button>
          )}
        </div>

        {/* Hero Content Section */}
        <div className={`space-y-10 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
          <div className="space-y-4">
            <h1 className="text-[40px] font-bold text-white leading-[1.1] tracking-tighter max-w-[320px] drop-shadow-2xl">
              {currentData.title}
            </h1>
            <p className="text-white/80 text-[16px] font-medium leading-relaxed max-w-[300px] drop-shadow-md">
              {currentData.subtitle}
            </p>
          </div>

          <div className="space-y-8">
            {/* Pagination Indicators */}
            <div className="flex gap-2">
               {ONBOARDING_STEPS.map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === i ? 'w-10 bg-[#FF6A00] shadow-lg shadow-orange-500/20' : 'w-1.5 bg-white/20'}`} 
                 />
               ))}
            </div>

            {/* Action Button - Adjusted to Medium Size (h-14/56px) */}
            <button 
              onClick={handleNext}
              className="group relative w-full h-14 text-white rounded-[22px] font-bold text-[16px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all duration-300 overflow-hidden bg-[#FF6A00]"
            >
              <span className="relative z-10">{currentData.button}</span>
              <ArrowRight size={18} strokeWidth={3} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
