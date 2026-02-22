
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, Search, MessageSquare, Phone, Mail, 
  ChevronRight, HelpCircle, Sparkles, X, Send
} from 'lucide-react';
import { FAQItem, SupportConfig } from '../types';

export const HelpSupport: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [supportConfig, setSupportConfig] = useState<SupportConfig>({
    chatEnabled: true,
    callEnabled: true,
    emailEnabled: true,
    supportPhone: '1800123456',
    supportEmail: 'support@foodi.com'
  });
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Load dynamic content
    const savedFaqs = localStorage.getItem('support_faq');
    if (savedFaqs) setFaqs(JSON.parse(savedFaqs));

    const savedConfig = localStorage.getItem('support_config');
    if (savedConfig) setSupportConfig(JSON.parse(savedConfig));
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-32 bg-[#F8FAFC] min-h-screen font-['Plus_Jakarta_Sans'] select-none">
      {/* Reference Image Header Layout */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-12 px-6 bg-white shadow-sm rounded-b-[64px] border-b border-slate-100/50">
        <div className="flex items-center gap-6 mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-14 h-14 bg-[#F8FAFC] rounded-[24px] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm active:scale-90 transition-all"
          >
            <ChevronLeft strokeWidth={4} size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-[#1C1917]">Help & Support</h1>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mt-1">Always here for you</p>
          </div>
        </div>

        {/* Search Bar - Matches visual style of ref image */}
        <div className="relative group">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} strokeWidth={3} />
          <input 
            type="text"
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-100 rounded-[32px] py-6 pl-16 pr-8 text-sm font-bold outline-none focus:bg-white focus:border-orange-200 transition-all shadow-inner placeholder:text-slate-300"
          />
        </div>
      </header>

      <main className="pt-[calc(env(safe-area-inset-top)+17rem)] px-6 space-y-12 animate-native-fade">
        {/* QUICK CONTACT SECTION */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-6">Quick Contact</h2>
          <div className="grid grid-cols-3 gap-4">
            {supportConfig.chatEnabled && (
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white p-6 py-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group"
              >
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-[28px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <MessageSquare size={26} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Chat</span>
              </button>
            )}
            
            {supportConfig.callEnabled && (
              <button 
                onClick={() => window.location.href = `tel:${supportConfig.supportPhone}`}
                className="bg-white p-6 py-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Phone size={26} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Call</span>
              </button>
            )}

            {supportConfig.emailEnabled && (
              <button 
                onClick={() => window.location.href = `mailto:${supportConfig.supportEmail}`}
                className="bg-white p-6 py-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Mail size={26} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Email</span>
              </button>
            )}
          </div>
        </section>

        {/* COMMON QUESTIONS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Common Questions</h2>
            <Sparkles size={16} className="text-orange-500 opacity-20" />
          </div>
          
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-white rounded-[32px] border border-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all hover:border-orange-100"
              >
                <div className="flex items-center gap-5">
                   <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <HelpCircle size={18} />
                   </div>
                   <p className="text-[15px] font-black text-slate-900 leading-tight">{faq.question}</p>
                </div>
                <ChevronRight size={20} className="text-slate-200" strokeWidth={4} />
              </div>
            )) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-100">
                  <Search size={32} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No articles found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* CHAT MODAL OVERLAY */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[5000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setIsChatOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-[80vh] rounded-t-[64px] flex flex-col shadow-2xl animate-native-up overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-orange-600 rounded-[20px] flex items-center justify-center text-white shadow-lg">
                      <Sparkles size={28} strokeWidth={3} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Foodi Support</h3>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Online
                      </p>
                   </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-4 bg-slate-50 rounded-2xl text-slate-400 active:scale-90"><X size={20} /></button>
             </div>
             <div className="flex-1 bg-[#F8FAFC]/50 p-10 overflow-y-auto no-scrollbar">
                <div className="bg-white p-6 rounded-[32px] rounded-tl-none text-sm font-bold text-slate-600 shadow-sm border border-slate-100 leading-relaxed">
                   Hello! I'm your Foodi Assistant. How can I help you today?
                </div>
             </div>
             <div className="p-10 bg-white border-t border-slate-50 flex gap-4">
                <input type="text" placeholder="Type your message..." className="flex-1 bg-[#F8FAFC] border border-slate-100 rounded-[28px] px-8 py-5 text-sm font-bold outline-none focus:bg-white focus:border-orange-200 transition-all shadow-inner" />
                <button className="w-16 h-16 bg-[#1C1917] text-white rounded-[24px] flex items-center justify-center shadow-lg active:scale-95 transition-all">
                   <Send size={20} strokeWidth={3} className="rotate-45" />
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-native-up { animation: up 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
