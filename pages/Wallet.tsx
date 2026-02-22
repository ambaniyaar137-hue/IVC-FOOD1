
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, Plus, ArrowUpRight, ArrowDownLeft, 
  Wallet as WalletIcon, Check, X, 
  QrCode, ArrowRight, Info, Clock, Sparkles,
  History, Camera, Image as ImageIcon, Trash2
} from 'lucide-react';
import { useApp } from '../App';
import { WalletRequest, WalletTransaction, WalletTransactionCategory } from '../types';

export const Wallet: React.FC = () => {
  const { user, setUser, designConfig, addNotification } = useApp();
  const navigate = useNavigate();

  // Wizard State
  const [wizardStep, setWizardStep] = useState<'IDLE' | 'AMOUNT' | 'PAY' | 'SUBMIT'>('IDLE');
  const [topupAmount, setTopupAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utrId, setUtrId] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Data States
  const [pendingRequests, setPendingRequests] = useState<WalletRequest[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const syncWalletData = useCallback(() => {
    if (!user) return;
    
    const savedUsers = localStorage.getItem('simulated_users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      const updatedSelf = allUsers.find((u: any) => u.uid === user.uid);
      if (updatedSelf) {
        const remoteBal = Number(updatedSelf.walletBalance) || 0;
        if (remoteBal !== (user.walletBalance || 0)) {
          const newUser = { ...user, walletBalance: remoteBal };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
        }
      }
    }

    const savedRequestsStr = localStorage.getItem('pending_wallet_requests') || '[]';
    const allRequests: WalletRequest[] = JSON.parse(savedRequestsStr);
    const userRequests = allRequests.filter(r => r.userUid === user.uid);
    setPendingRequests(userRequests);
    
    const savedLogsStr = localStorage.getItem('wallet_logs') || '[]';
    const allLogs: WalletTransaction[] = JSON.parse(savedLogsStr);
    const userLogs = allLogs.filter(log => log.walletId === user.uid);
    setTransactions(userLogs);
  }, [user, setUser]);

  useEffect(() => {
    syncWalletData();
    const interval = setInterval(syncWalletData, 3000);
    return () => clearInterval(interval);
  }, [syncWalletData]);

  const resetWizard = () => {
    setWizardStep('IDLE');
    setRequestSubmitted(false);
    setIsSubmitting(false);
    setTopupAmount('');
    setUtrId('');
    setProofImage(null);
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTopup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // NEW LOGIC: Either UTR OR Proof Image is mandatory, not both.
    const hasUtr = utrId.trim().length >= 6;
    const hasProof = !!proofImage;

    if (!hasUtr && !hasProof) {
      setError("Please provide UTR ID or upload a screenshot");
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    const newRequest: WalletRequest = {
      id: 'REQ-' + Math.random().toString(36).substr(2, 9),
      userUid: user!.uid,
      userName: user!.name,
      userRole: user!.role,
      amount: parseFloat(topupAmount),
      type: 'TOPUP',
      utr: utrId.trim() || undefined,
      proofImage: proofImage || undefined,
      status: 'PENDING',
      createdAt: Date.now()
    };

    const savedRequests = JSON.parse(localStorage.getItem('pending_wallet_requests') || '[]');
    localStorage.setItem('pending_wallet_requests', JSON.stringify([newRequest, ...savedRequests]));

    addNotification({
      title: 'Top-up Under Review ⏳',
      message: `Your wallet top-up request of ₹${topupAmount} is under review.`,
      type: 'system',
      link: '/profile/wallet'
    });

    setIsSubmitting(false);
    setRequestSubmitted(true);
    setTimeout(resetWizard, 2500);
  };

  const getStatusUI = (status: WalletRequest['status']) => {
    switch (status) {
      case 'PENDING': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Pending Approval' };
      case 'APPROVED': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Approved' };
      case 'REJECTED': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Rejected' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100', label: 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-44 animate-page-load flex flex-col font-['Inter']">
      
      {/* 1. NATIVE HEADER SECTION */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#F8F9FB] px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4">
        <div className="grid grid-cols-3 items-center w-full max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center active:scale-90 transition-all border border-slate-100/50"
          >
            <ChevronLeft size={20} strokeWidth={3} className="text-slate-900" />
          </button>
          
          <h1 className="text-[17px] font-bold text-slate-900 text-center tracking-tight">
            Virtual Wallet
          </h1>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setWizardStep('AMOUNT')} 
              className="w-10 h-10 text-white rounded-full shadow-[0_4px_12px_rgba(255,106,0,0.3)] flex items-center justify-center active:scale-90 transition-all" 
              style={{ backgroundColor: designConfig.primaryColor }}
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 mt-[calc(env(safe-area-inset-top)+5.5rem)] px-6 max-w-4xl mx-auto w-full space-y-8">
        
        {/* 2. AVAILABLE CREDIT CARD */}
        <div className="bg-white p-8 rounded-[36px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={14} strokeWidth={4} className="text-orange-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500/80">Available Credit</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-slate-300 mr-2">₹</span>
                <h2 className="text-[52px] font-extrabold text-slate-900 tracking-tighter leading-none">
                  {(Number(user?.walletBalance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
              </div>
              
              <div className="flex items-center gap-1.5 px-4 py-2 bg-[#F0FDF4] text-[#10B981] rounded-full border border-[#DCFCE7] shadow-sm self-end mb-1">
                <Check size={12} strokeWidth={4} />
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">Verified</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-50/20 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-100/30 transition-colors duration-700" />
        </div>

        {/* 3. PENDING REQUESTS SECTION */}
        {pendingRequests.filter(r => r.status !== 'APPROVED').length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <Clock size={16} className="text-amber-500" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Under Review</h2>
            </div>
            <div className="space-y-3">
              {pendingRequests.filter(r => r.status !== 'APPROVED').map((req) => {
                const ui = getStatusUI(req.status);
                return (
                  <div key={req.id} className="p-5 bg-white rounded-[24px] border border-white shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 ${ui.bg} ${ui.text}`}>
                        <History size={20} strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[14px] text-slate-900 tracking-tight">Deposit Request</h3>
                        <p className="text-[10px] text-slate-300 font-medium uppercase mt-1">Ref: {req.utr?.slice(-6) || '---'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-[15px] tracking-tight text-slate-900">₹{req.amount.toLocaleString()}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border mt-1 inline-block ${ui.bg} ${ui.text} ${ui.border}`}>
                        {ui.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. TRANSACTION HISTORY SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Recent Activity</h2>
            </div>
            <Sparkles size={14} className="text-slate-200" />
          </div>
          
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice().reverse().map((tx) => (
                <div key={tx.transactionId} className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.01)] active:scale-[0.98] transition-all group overflow-hidden relative">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-sm ${tx.transactionType === 'credit' ? 'bg-[#F0FDF4] text-[#10B981]' : 'bg-[#F8FAFC] text-slate-400'}`}>
                      {tx.transactionType === 'credit' ? <ArrowDownLeft size={20} strokeWidth={3} /> : <ArrowUpRight size={20} strokeWidth={3} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[14px] text-slate-900 tracking-tight truncate leading-tight">{tx.description}</h3>
                      <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest mt-1">
                        {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4 relative z-10">
                    <p className={`font-extrabold text-[15px] tracking-tight ${tx.transactionType === 'credit' ? 'text-[#10B981]' : 'text-slate-900'}`}>
                      {tx.transactionType === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
                    <span className="text-[8px] font-bold text-slate-200 uppercase tracking-widest block mt-0.5">COMPLETED</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-white rounded-[40px] border border-slate-50 flex items-center justify-center shadow-sm relative group">
                  <WalletIcon size={32} className="text-slate-100 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">No activity found</p>
                  <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest max-w-[180px] mx-auto leading-relaxed">Your completed transactions will appear here</p>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* MODAL / WIZARD OVERLAYS */}
      {wizardStep !== 'IDLE' && (
        <div className="fixed inset-0 z-[5000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={resetWizard} />
          <div className="relative bg-white w-full max-w-md rounded-t-[48px] shadow-2xl animate-modal-up overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-4 shrink-0">
               <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-8" />
               <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add Credit</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Manual Approval Required</p>
                </div>
                <button onClick={resetWizard} className="w-10 h-10 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center active:scale-90 transition-all border border-slate-100"><X size={18} strokeWidth={3} /></button>
               </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-4">
              {wizardStep === 'AMOUNT' && (
                <div className="space-y-8 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-3 gap-3">
                    {['500', '1000', '2500'].map(val => (
                      <button key={val} onClick={() => setTopupAmount(val)} className={`py-4 rounded-2xl text-[11px] font-bold uppercase transition-all ${topupAmount === val ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'}`}>₹{val}</button>
                    ))}
                  </div>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300" style={{ color: topupAmount ? designConfig.primaryColor : undefined }}>₹</span>
                    <input autoFocus type="number" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-6 pl-12 pr-6 text-3xl font-bold outline-none focus:bg-white focus:border-orange-500/20 transition-all text-slate-900" placeholder="0" />
                  </div>
                </div>
              )}

              {wizardStep === 'PAY' && (
                <div className="space-y-8 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center gap-6 shadow-inner">
                    <div className="w-40 h-40 bg-white p-3 rounded-[24px] shadow-sm flex items-center justify-center border border-slate-100">
                      <QrCode size={120} strokeWidth={1.5} className="text-slate-900" />
                    </div>
                    <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Scan QR to pay ₹{topupAmount}</p>
                  </div>
                </div>
              )}

              {wizardStep === 'SUBMIT' && (
                <div className="space-y-8 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-6">
                    {/* UTR Input */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Option 1: UTR ID</label>
                        {utrId && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Selected</span>}
                      </div>
                      <input 
                        autoFocus
                        required
                        value={utrId}
                        onChange={(e) => {setUtrId(e.target.value); if(e.target.value) setError(null);}}
                        placeholder="Enter 12-digit number" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-5 px-7 text-sm font-bold outline-none focus:bg-white focus:border-orange-500/20 transition-all text-slate-900" 
                      />
                    </div>

                    <div className="flex items-center gap-4 px-8">
                       <div className="h-[1px] flex-1 bg-slate-100" />
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                       <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>

                    {/* Snapshot Upload Area */}
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-1">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Option 2: Payment Snapshot</label>
                         {proofImage && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Selected</span>}
                       </div>
                       <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                       />
                       
                       {!proofImage ? (
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] py-10 flex flex-col items-center gap-3 active:bg-slate-100 transition-all"
                         >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300">
                               <Camera size={24} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Screenshot</span>
                         </button>
                       ) : (
                         <div className="relative group rounded-[32px] overflow-hidden border-2 border-slate-100 shadow-sm">
                            <img src={proofImage} className="w-full h-48 object-cover" alt="Proof" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                               <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white text-slate-900 rounded-xl shadow-lg active:scale-90"><ImageIcon size={20} /></button>
                               <button onClick={() => setProofImage(null)} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg active:scale-90"><Trash2 size={20} /></button>
                            </div>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-5 rounded-[24px] border border-blue-100 flex gap-3.5 text-blue-600">
                    <Info size={16} strokeWidth={3} className="shrink-0 mt-0.5" />
                    <p className="text-[11px] font-semibold leading-relaxed">Verification takes ~30 mins. Providing either UTR or a screenshot is enough for our team.</p>
                  </div>
                  
                  {error && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-4 text-center">{error}</p>}
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-8 pt-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] border-t border-slate-50 bg-white shrink-0">
               {wizardStep === 'AMOUNT' && (
                  <button disabled={!topupAmount} onClick={() => setWizardStep('PAY')} className="w-full py-5 text-white rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50" style={{ backgroundColor: designConfig.primaryColor }}>
                    Continue <ArrowRight size={16} strokeWidth={3} />
                  </button>
               )}
               {wizardStep === 'PAY' && (
                  <div className="space-y-3">
                    <button onClick={() => setWizardStep('SUBMIT')} className="w-full py-5 text-white rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all" style={{ backgroundColor: designConfig.primaryColor }}>I've paid</button>
                    <button onClick={() => setWizardStep('AMOUNT')} className="w-full py-5 bg-slate-50 text-slate-400 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all">Change Amount</button>
                  </div>
               )}
               {wizardStep === 'SUBMIT' && (
                  <button 
                    onClick={handleSubmitTopup}
                    disabled={isSubmitting}
                    className="w-full py-5 text-white rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50" 
                    style={{ backgroundColor: designConfig.primaryColor }}
                  >
                    {isSubmitting ? 'Verifying...' : 'Submit Request'}
                    {!isSubmitting && <Check size={16} strokeWidth={3} />}
                  </button>
               )}
            </div>
            
            {requestSubmitted && (
              <div className="absolute inset-0 bg-white z-[5100] flex flex-col items-center justify-center p-10 animate-fade-in text-center space-y-6">
                <div className="w-20 h-20 bg-[#F0FDF4] rounded-[28px] flex items-center justify-center border-2 border-[#DCFCE7] text-[#10B981] shadow-lg animate-bounce-slow">
                  <Check size={40} strokeWidth={4} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Request Submitted</h2>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-1.5">Awaiting Admin Verification</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .animate-page-load { animation: page-load 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes page-load { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-modal-up { animation: modal-up 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes modal-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};
