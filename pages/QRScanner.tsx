
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  QrCode, Camera, ChevronLeft, Info, 
  Zap, ZapOff, Keyboard, Loader2, Sparkles,
  Search
} from 'lucide-react';
import { useApp } from '../App';

export const QRScanner: React.FC = () => {
  const navigate = useNavigate();
  const { designConfig, setDiningSession } = useApp();
  const [scanning, setScanning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [tableCode, setTableCode] = useState('');

  const simulateScan = () => {
    setScanning(true);
    // Simulate table & restaurant validation
    setTimeout(() => {
      const mockSession = {
        restaurantId: 'res1',
        restaurantName: 'The Signature Burger',
        branchId: 'BR-001',
        tableNumber: '12',
        sessionToken: 'SES-' + Math.random().toString(36).substr(2, 9),
        startTime: Date.now()
      };
      setDiningSession(mockSession);
      navigate('/restaurant/res1?tableId=12');
    }, 2500);
  };

  const handleManualSubmit = () => {
    if (tableCode.length < 4) return;
    simulateScan();
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-black overflow-hidden font-['Inter']">
      {/* 1. Cinematic Camera Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200" 
          className={`w-full h-full object-cover transition-all duration-[2s] ${scanning ? 'scale-110 blur-md opacity-40' : 'opacity-60 grayscale'}`} 
          alt="camera preview" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      </div>

      {/* 2. Top Controls Overlay */}
      <header className="absolute top-0 left-0 right-0 z-50 p-8 pt-[calc(env(safe-area-inset-top)+1.5rem)] flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        
        <div className="flex gap-4">
           <button 
             onClick={() => setFlash(!flash)}
             className={`w-12 h-12 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all ${flash ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'}`}
           >
             {flash ? <Zap size={20} fill="white" /> : <ZapOff size={20} />}
           </button>
           <button 
             onClick={() => setManualEntry(!manualEntry)}
             className={`w-12 h-12 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all ${manualEntry ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
           >
             <Keyboard size={20} />
           </button>
        </div>
      </header>

      {/* 3. Central Scanning Experience */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-10">
        {!manualEntry ? (
          <div className="relative w-full max-w-[280px] aspect-square">
            {/* Animated Scanning Frame */}
            <div className={`absolute inset-0 border-2 border-white/20 rounded-[48px] transition-all duration-700 ${scanning ? 'border-orange-500 scale-105' : ''}`}>
               {/* Corner Accents */}
               <div className="absolute top-[-4px] left-[-4px] w-12 h-12 border-t-4 border-l-4 border-orange-500 rounded-tl-[44px]" />
               <div className="absolute top-[-4px] right-[-4px] w-12 h-12 border-t-4 border-r-4 border-orange-500 rounded-tr-[44px]" />
               <div className="absolute bottom-[-4px] left-[-4px] w-12 h-12 border-b-4 border-l-4 border-orange-500 rounded-bl-[44px]" />
               <div className="absolute bottom-[-4px] right-[-4px] w-12 h-12 border-b-4 border-r-4 border-orange-500 rounded-br-[44px]" />
               
               {/* Scan Line */}
               <div className={`absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_20px_rgba(255,106,0,0.8)] animate-scan-bounce ${!scanning ? 'hidden' : ''}`} />
            </div>

            <div className="absolute inset-4 rounded-[40px] border border-white/10 flex flex-col items-center justify-center">
              {scanning ? (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <Loader2 size={32} className="text-orange-500 animate-spin" />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Syncing Table #12</p>
                </div>
              ) : (
                <div className="text-center space-y-3 px-8">
                  <QrCode size={48} className="text-white/20 mx-auto" strokeWidth={1} />
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Align with Table QR</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[320px] bg-black/60 backdrop-blur-3xl p-10 rounded-[48px] border border-white/10 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-10">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5 mb-6">
                   <Keyboard size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Manual Entry</h2>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-2">Enter the 6-digit code on your table</p>
             </div>
             
             <div className="relative group">
                <input 
                  autoFocus
                  maxLength={6}
                  value={tableCode}
                  onChange={(e) => setTableCode(e.target.value.toUpperCase())}
                  placeholder="EX: T12-BR" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-center text-xl font-black text-white outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                />
             </div>

             <button 
               onClick={handleManualSubmit}
               disabled={tableCode.length < 4}
               className="w-full mt-6 bg-white text-black py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-20"
             >
               Confirm Table
             </button>
          </div>
        )}
      </div>

      {/* 4. Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-10 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-center space-y-8">
        {!scanning && !manualEntry && (
          <button 
            onClick={simulateScan}
            className="w-full h-20 bg-orange-600 text-white rounded-[32px] font-black text-[13px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,106,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 group border-2 border-white/10"
          >
            Start Scan <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}
        
        <div className="flex items-center justify-center gap-4 text-white/40">
           <div className="h-[1px] w-12 bg-white/10" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em]">SECURE DINING SESSION</span>
           <div className="h-[1px] w-12 bg-white/10" />
        </div>
      </div>

      <style>{`
        @keyframes scan-bounce {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-bounce {
          animation: scan-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
