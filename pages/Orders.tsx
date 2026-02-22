
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, RefreshCw, Star, Filter, Calendar, X, Search, 
  Check, Receipt, ShoppingBag, Clock, ChevronRight, 
  FileText, HelpCircle, Download, AlertCircle, MessageCircle,
  Truck, Utensils, CreditCard, ShieldCheck, Store, Loader2, Send, Sparkles, SortAsc, SortDesc
} from 'lucide-react';
import { useApp } from '../App';
import { OrderStatus, CartItem } from '../types';
import { GoogleGenAI } from "@google/genai";

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { theme, addToCart, designConfig } = useApp();
  
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Delivered' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // States for Invoice and Support
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [supportOrder, setSupportOrder] = useState<any | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  
  // Chat States
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const allOrders = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const may24 = new Date(2024, 4, 24);

    return [
      { 
        id: 'ORD9122', 
        restaurant: 'The Signature Burger', 
        restaurantId: 'res1',
        items: '2 Items • ₹450.00', 
        dateStr: 'Today, 2:30 PM',
        timestamp: today.getTime(),
        status: OrderStatus.PLACED as OrderStatus,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400',
        itemsList: [
          { id: 'm1', outletId: 'res1', name: 'Signature Double Burger', price: 299.00, quantity: 1, category: 'Main' },
          { id: 'm3', outletId: 'res1', name: 'Truffle Fries', price: 151.00, quantity: 1, category: 'Sides' },
        ]
      },
      { 
        id: 'ORD8821', 
        restaurant: 'The Pizza Palace', 
        restaurantId: 'res3',
        items: '1 Item • ₹320.00', 
        dateStr: 'Yesterday, 8:15 PM', 
        timestamp: yesterday.getTime(),
        status: OrderStatus.DELIVERED as OrderStatus,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
        itemsList: [
          { id: 'm10', outletId: 'res3', name: 'Gourmet Margherita', price: 320.00, quantity: 1, category: 'Pizza' },
        ],
        fees: { delivery: 40.0, tax: 25.50 }
      },
      { 
        id: 'ORD7721', 
        restaurant: 'Garden Fresh Cafe', 
        restaurantId: 'res2',
        items: '3 Items • ₹890.00', 
        dateStr: '24 May 2024', 
        timestamp: may24.getTime(),
        status: OrderStatus.CANCELLED as OrderStatus,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400',
        itemsList: [
          { id: 'm20', outletId: 'res2', name: 'Organic Salad Bowl', price: 890.00, quantity: 1, category: 'Healthy' },
        ]
      },
    ];
  }, []);

  const filteredOrders = useMemo(() => {
    let result = allOrders.filter(order => {
      let statusMatch = true;
      if (activeFilter === 'Active') {
        statusMatch = ([OrderStatus.PLACED, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.PICKED_UP, OrderStatus.OUT_FOR_DELIVERY] as any[]).includes(order.status);
      } else if (activeFilter === 'Delivered') {
        statusMatch = order.status === OrderStatus.DELIVERED;
      } else if (activeFilter === 'Cancelled') {
        statusMatch = order.status === OrderStatus.CANCELLED;
      }
      const searchMatch = order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
    return result.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });
  }, [allOrders, activeFilter, searchQuery, sortBy]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleStartChat = () => {
    if (!selectedIssue || !supportOrder) return;
    setIsSupportChatOpen(true);
    setChatHistory([
      { role: 'model', text: `Hi there! I see you have an issue regarding "${selectedIssue}" for your order from ${supportOrder.restaurant}. How can I assist you today?` }
    ]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are an elite customer support agent for 'Foodi', a premium food delivery platform. 
      You are helping a customer with order ID ${supportOrder?.id} from ${supportOrder?.restaurant}. 
      The customer has selected the issue: ${selectedIssue}.
      Keep responses concise and under 60 words.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: { systemInstruction, temperature: 0.7 }
      });
      const aiText = response.text || "I'm sorry, I'm having trouble connecting to support.";
      setChatHistory(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "We're experiencing heavy traffic." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReorder = (e: React.MouseEvent, items: any[], orderId: string) => {
    e.stopPropagation();
    items.forEach(item => addToCart(item as any));
    setReorderSuccess(orderId);
    setTimeout(() => setReorderSuccess(null), 2000);
  };

  const handleCardClick = (order: any) => {
    const activeStatuses = [
      OrderStatus.PLACED, OrderStatus.ACCEPTED, OrderStatus.PREPARING, 
      OrderStatus.READY, OrderStatus.PICKED_UP, OrderStatus.OUT_FOR_DELIVERY
    ];
    if (activeStatuses.includes(order.status)) {
      navigate(`/orders/${order.id}`);
    }
  };

  const handleDownloadInvoice = async (order: any) => {
    setIsDownloading(true);
    await new Promise(r => setTimeout(r, 1500));
    const totalPaid = (order.itemsList.reduce((acc: number, curr: any) => acc + curr.price, 0) + 40 + 25.50).toFixed(2);
    
    const printableContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1C1917; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 800; letter-spacing: -1.5px; }
            .logo span { color: #FF4D00; }
            .order-meta { text-align: right; }
            .order-meta p { margin: 2px 0; font-size: 11px; color: #64748b; font-weight: 800; letter-spacing: -0.2px; }
            .restaurant-box { background: #f8fafc; padding: 24px; border-radius: 20px; margin-bottom: 30px; }
            .restaurant-box h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; font-size: 10px; text-transform: uppercase; color: #94a3b8; padding: 12px 0; border-bottom: 1px solid #e2e8f0; letter-spacing: 1px; font-weight: 800; }
            td { padding: 16px 0; font-size: 14px; font-weight: 800; border-bottom: 1px solid #f1f5f9; }
            .totals { margin-left: auto; width: 280px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; font-weight: 800; }
            .row.grand { margin-top: 15px; padding-top: 15px; border-top: 2px solid #1c1917; font-size: 20px; font-weight: 800; letter-spacing: -0.8px; }
            .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #94a3b8; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 800; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">foodi<span>.</span></div>
            <div class="order-meta"><p>INVOICE NO: #${order.id}</p><p>DATE: ${order.dateStr}</p></div>
          </div>
          <div class="restaurant-box"><h2>${order.restaurant}</h2><p style="font-size: 12px; font-weight: 800; color: #94a3b8; margin: 4px 0 0;">Signature Outlet</p></div>
          <table>
            <thead><tr><th>ITEM</th><th style="text-align: center">QTY</th><th style="text-align: right">TOTAL</th></tr></thead>
            <tbody>
              ${order.itemsList.map((item: any) => `<tr><td>${item.name}</td><td style="text-align: center">${item.quantity}</td><td style="text-align: right">₹${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="row"><span>Subtotal</span><span>₹${order.itemsList.reduce((acc: number, curr: any) => acc + curr.price, 0).toFixed(2)}</span></div>
            <div class="row grand"><span>Total Amount</span><span>₹${totalPaid}</span></div>
          </div>
          <div class="footer">Premium Service via Foodi Platform</div>
          <script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };</script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printableContent);
      printWindow.document.close();
    }
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-500 flex flex-col relative font-['Plus_Jakarta_Sans'] select-none" style={{ backgroundColor: 'var(--brand-bg)' }}>
      {/* PREMIUM HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 px-6 bg-white border-b border-gray-50 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#1C1C1E] active:scale-90 transition-all shadow-sm">
              <ChevronLeft strokeWidth={4} size={20} />
            </button>
            <div className="flex flex-col">
               <h1 className="text-[26px] font-black text-[#1C1917] tracking-tighter leading-none">
                 Order History
               </h1>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-80">Your Culinary Journey</p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)} 
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${showFilterMenu ? 'text-white shadow-lg' : 'bg-white text-[#1C1C1E] border border-gray-100 shadow-sm'}`}
              style={{ backgroundColor: showFilterMenu ? designConfig.primaryColor : undefined }}
            >
              <Filter size={18} strokeWidth={4} />
            </button>

            {/* FILTER & SORT DROPDOWN */}
            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                <div className="absolute top-14 right-0 w-64 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-50 p-6 z-50 animate-spring-up">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 mb-5 ml-2">Sort Orders By</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => { setSortBy('newest'); setShowFilterMenu(false); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${sortBy === 'newest' ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <SortDesc size={16} strokeWidth={4} style={{ color: sortBy === 'newest' ? designConfig.primaryColor : '#CBD5E1' }} />
                        <span className={`text-[13px] font-black tracking-tight ${sortBy === 'newest' ? 'text-slate-900' : 'text-slate-400'}`}>Newest First</span>
                      </div>
                      {sortBy === 'newest' && <Check size={14} strokeWidth={4} style={{ color: designConfig.primaryColor }} />}
                    </button>
                    
                    <button 
                      onClick={() => { setSortBy('oldest'); setShowFilterMenu(false); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${sortBy === 'oldest' ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <SortAsc size={16} strokeWidth={4} style={{ color: sortBy === 'oldest' ? designConfig.primaryColor : '#CBD5E1' }} />
                        <span className={`text-[13px] font-black tracking-tight ${sortBy === 'oldest' ? 'text-slate-900' : 'text-slate-400'}`}>Oldest First</span>
                      </div>
                      {sortBy === 'oldest' && <Check size={14} strokeWidth={4} style={{ color: designConfig.primaryColor }} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} strokeWidth={3} style={{ color: searchQuery ? designConfig.primaryColor : undefined }} />
          <input 
            type="text" 
            placeholder="Search flavor or order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-bold text-[#1C1E21] outline-none focus:bg-white transition-all shadow-sm placeholder:text-slate-300"
            style={{ borderColor: searchQuery ? `${designConfig.primaryColor}33` : undefined }}
          />
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {['All', 'Active', 'Delivered', 'Cancelled'].map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f as any)} 
              className={`flex-none px-5 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
              style={{ backgroundColor: activeFilter === f ? designConfig.primaryColor : undefined }}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-[calc(env(safe-area-inset-top)+17rem)] px-6 pb-40 space-y-5 overflow-y-auto no-scrollbar">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} onClick={() => handleCardClick(order)} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm transition-all group active:scale-[0.98] cursor-pointer">
              <div className="flex gap-5 mb-6">
                <div className="w-16 h-16 rounded-[22px] overflow-hidden border border-gray-50 shadow-sm flex-none">
                  <img src={order.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={order.restaurant} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[16px] font-black tracking-tight text-[#1C1C1E] truncate pr-2">{order.restaurant}</h3>
                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === OrderStatus.CANCELLED ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
                    }`} style={{ color: order.status === OrderStatus.PLACED ? designConfig.primaryColor : undefined }}>
                      {order.status === OrderStatus.DELIVERED && <Check size={8} strokeWidth={4} />}
                      {order.status}
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 tracking-tight">{order.items}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    <Clock size={10} strokeWidth={4} /> {order.dateStr}
                  </div>
                </div>
              </div>

              {order.status === OrderStatus.DELIVERED ? (
                <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-50">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedInvoice(order); }} className="h-12 bg-slate-50 text-slate-600 rounded-[18px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <FileText size={14} strokeWidth={4} className="text-slate-300" /> Invoice
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSupportOrder(order); }} className="h-12 bg-slate-50 text-slate-600 rounded-[18px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <HelpCircle size={14} strokeWidth={4} className="text-slate-300" /> Support
                  </button>
                </div>
              ) : (
                <div className="pt-5 border-t border-slate-50">
                   <button onClick={(e) => handleReorder(e, order.itemsList, order.id)} className={`w-full h-12 rounded-[18px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all text-white shadow-lg ${reorderSuccess === order.id ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-[#1C1917]'}`} style={{ backgroundColor: reorderSuccess !== order.id ? designConfig.primaryColor : undefined }}>
                     {reorderSuccess === order.id ? <><Check size={16} strokeWidth={4} /> Added to Cart</> : <><RefreshCw size={16} strokeWidth={4} /> Reorder Now</>}
                   </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center text-center px-10">
             <div className="w-24 h-24 bg-gray-50 rounded-[44px] flex items-center justify-center mb-8 text-slate-100">
                <Search size={48} strokeWidth={1} />
             </div>
             <h2 className="text-[20px] font-black tracking-tighter text-[#1C1C1E] mb-2">No results found</h2>
             <p className="text-slate-400 text-[13px] font-bold leading-relaxed opacity-80">Adjust your search or filters to see past orders.</p>
          </div>
        )}
      </main>

      {/* INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-end">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={() => setSelectedInvoice(null)} />
           <div className="relative bg-white w-full max-w-md rounded-t-[56px] p-10 pb-[calc(env(safe-area-inset-bottom)+2rem)] shadow-2xl animate-native-up overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between mb-10 shrink-0">
                 <div>
                    <h2 className="text-[24px] font-black tracking-tighter text-[#1C1C1E]">Order Invoice</h2>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1.5 opacity-80">Order ID #{selectedInvoice.id.slice(-4)}</p>
                 </div>
                 <button onClick={() => setSelectedInvoice(null)} className="p-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl active:scale-90 flex items-center justify-center">
                    <X size={20} strokeWidth={4} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 px-1">
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                          <Store size={22} strokeWidth={3} style={{ color: designConfig.primaryColor }} />
                       </div>
                       <div>
                          <p className="font-black text-[16px] text-[#1C1C1E] tracking-tight">{selectedInvoice.restaurant}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-80">Signature Outlet</p>
                       </div>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 ml-2 opacity-80">Order Breakdown</h4>
                    <div className="space-y-6">
                       {selectedInvoice.itemsList.map((item: any, i: number) => (
                         <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <span className="text-[11px] font-black bg-orange-50 px-2 py-0.5 rounded-lg" style={{ color: designConfig.primaryColor, backgroundColor: `${designConfig.primaryColor}15` }}>{item.quantity}x</span>
                               <p className="font-black text-[15px] text-[#1C1C1E] tracking-tight">{item.name}</p>
                            </div>
                            <span className="font-black text-[15px] text-[#1C1C1E]">₹{item.price.toFixed(2)}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="pt-10 shrink-0">
                 <button disabled={isDownloading} onClick={() => handleDownloadInvoice(selectedInvoice)} className="w-full h-16 text-white rounded-[24px] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-xl disabled:opacity-70" style={{ backgroundColor: designConfig.primaryColor }}>
                    {isDownloading ? <><Loader2 size={18} className="animate-spin" /> Preparing...</> : <><Download size={18} strokeWidth={4} /> Download PDF</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SUPPORT CHAT MODAL */}
      {isSupportChatOpen && (
        <div className="fixed inset-0 z-[4000] flex flex-col items-center justify-end">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in" onClick={() => setIsSupportChatOpen(false)} />
           <div className="relative bg-white w-full max-w-md h-[90vh] rounded-t-[56px] flex flex-col shadow-2xl animate-native-up overflow-hidden">
              <div className="p-10 border-b border-gray-100 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[22px] flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: designConfig.primaryColor }}>
                       <Sparkles size={28} strokeWidth={3} />
                    </div>
                    <div>
                       <h3 className="font-black text-xl text-[#1C1C1E] tracking-tighter leading-none">Foodi Support</h3>
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 opacity-80 mt-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Agent Online
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setIsSupportChatOpen(false)} className="p-3.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl active:scale-90 flex items-center justify-center">
                    <X size={20} strokeWidth={4} />
                 </button>
              </div>
              <div className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar bg-slate-50/20">
                 {chatHistory.map((msg, idx) => (
                   <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`px-6 py-4 rounded-[28px] max-w-[85%] shadow-sm text-[15px] font-bold ${
                        msg.role === 'user' ? 'text-white rounded-tr-none' : 'bg-white text-[#1C1C1E] rounded-tl-none border border-gray-100'
                      }`} style={{ backgroundColor: msg.role === 'user' ? designConfig.primaryColor : undefined }}>
                         <p className="leading-relaxed">{msg.text}</p>
                      </div>
                   </div>
                 ))}
                 <div ref={chatEndRef} />
              </div>
              <div className="p-8 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] border-t border-gray-100 flex gap-4 shrink-0 bg-white">
                 <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type message..." className="flex-1 bg-slate-50 border border-slate-100 rounded-[28px] px-8 py-5 text-[14px] font-bold text-[#1C1C1E] outline-none focus:bg-white" />
                 <button onClick={handleSendMessage} disabled={isTyping} className="w-16 h-16 text-white rounded-[24px] flex items-center justify-center shadow-xl active:scale-90 transition-all flex-none disabled:opacity-50" style={{ backgroundColor: designConfig.primaryColor }}>
                    <Send size={20} strokeWidth={4} className="rotate-45" />
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .animate-native-up { animation: up 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-spring-up { animation: springUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes springUp { from { transform: translateY(10px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};
