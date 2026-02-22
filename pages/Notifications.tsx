
import React from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, Bell, BellOff, CheckCircle2, 
  Bike, Tag, ShieldCheck, Sparkles, Trash2, Clock, Check, X
} from 'lucide-react';
import { useApp } from '../App';
import { AppNotification, NotificationType } from '../types';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications, 
    designConfig 
  } = useApp();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'order': return <Bike size={20} strokeWidth={2.5} />;
      case 'promo': return <Tag size={20} strokeWidth={2.5} />;
      case 'recommendation': return <Sparkles size={20} strokeWidth={2.5} />;
      default: return <Bell size={20} strokeWidth={2.5} />;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'order': return '#FF6A00';
      case 'promo': return '#10B981';
      case 'recommendation': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (note: AppNotification) => {
    markAsRead(note.id);
    if (note.link && note.link.startsWith('/')) {
      navigate(note.link);
    }
  };

  return (
    <div className="min-h-screen pb-40 animate-native-fade pt-safe-premium px-6 transition-colors duration-500" style={{ backgroundColor: 'var(--brand-bg)' }}>
      {/* HEADER - INCREASED MARGIN AND PADDING FOR PROFESSIONAL SPACING */}
      <header className="flex items-center justify-between mb-12 animate-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white text-slate-900 rounded-[18px] shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center justify-center"
          >
            <ChevronLeft strokeWidth={4} size={22} />
          </button>
          <div>
             <h1 className="text-[26px] font-black tracking-tighter text-[#1C1917] leading-none">Alerts</h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Notifications Hub</p>
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              title="Mark all as read"
              className="w-11 h-11 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all text-slate-400 hover:text-orange-500 flex items-center justify-center"
            >
              <Check size={20} strokeWidth={3} />
            </button>
            <button 
              onClick={clearAllNotifications}
              title="Clear all notifications"
              className="w-11 h-11 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all text-slate-400 hover:text-rose-500 flex items-center justify-center"
            >
              <Trash2 size={20} strokeWidth={3} />
            </button>
          </div>
        )}
      </header>

      {/* LIST */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div 
              key={note.id}
              className={`p-6 rounded-[32px] border transition-all relative overflow-hidden active:scale-[0.98] cursor-pointer ${
                note.isRead ? 'bg-white/60 border-slate-100 opacity-70' : 'bg-white border-white shadow-lg shadow-black/5'
              }`}
              onClick={() => handleNotificationClick(note)}
            >
              {!note.isRead && (
                <div 
                  className="absolute top-0 right-0 w-1.5 h-full" 
                  style={{ backgroundColor: designConfig.primaryColor }}
                />
              )}
              
              <div className="flex gap-5">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
                  style={{ backgroundColor: `${getColor(note.type)}15`, color: getColor(note.type) }}
                >
                  {getIcon(note.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-black tracking-tight text-[#1C1917] truncate leading-tight pr-4">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-300 text-[9px] font-bold uppercase tracking-widest flex-none">
                      <Clock size={10} strokeWidth={3} />
                      {getRelativeTime(note.timestamp)}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-3">
                    {note.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider">
                      {note.type}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotification(note.id); }}
                      className="p-2 bg-slate-50 text-slate-300 hover:text-rose-500 rounded-lg active:scale-75 transition-all"
                    >
                      <X size={14} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center text-center space-y-8 px-10">
            <div className="w-40 h-40 bg-white rounded-[56px] flex items-center justify-center relative shadow-sm border border-slate-50">
               <BellOff size={80} className="text-slate-100" strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#1C1917]">All caught up!</h3>
              <p className="text-slate-400 text-sm font-medium mt-2 max-w-[240px] mx-auto">
                No new alerts. We'll ping you as soon as something tasty happens.
              </p>
            </div>
            <button 
              onClick={() => navigate('/')} 
              className="text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95"
              style={{ backgroundColor: designConfig.primaryColor }}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* FOOTER BADGE */}
      <div className="mt-12 flex items-center justify-center gap-2 opacity-20">
         <ShieldCheck size={14} />
         <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Notifications</span>
      </div>

      <style>{`
        .animate-native-fade { animation: fade 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
