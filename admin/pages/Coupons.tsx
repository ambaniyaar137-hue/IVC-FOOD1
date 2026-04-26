
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import Modal from '../components/Modal';
import { Search, Plus, Ticket, Calendar, MoreVertical, Tag, Percent, IndianRupee, Check } from 'lucide-react';

const Coupons: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([
    { id: 'CPN-101', code: 'WELCOME50', type: 'PERCENTAGE', value: '50%', minOrder: '₹200', expiry: '2026-12-31', usage: 1240, status: 'ACTIVE' },
    { id: 'CPN-102', code: 'FLAT100', type: 'FIXED', value: '₹100', minOrder: '₹500', expiry: '2026-06-30', usage: 890, status: 'ACTIVE' },
    { id: 'CPN-103', code: 'FREEDEL', type: 'PERCENTAGE', value: '100%', minOrder: '₹300', expiry: '2026-03-15', usage: 450, status: 'EXPIRED' },
    { id: 'CPN-104', code: 'HUNGER20', type: 'PERCENTAGE', value: '20%', minOrder: '₹150', expiry: '2026-09-20', usage: 670, status: 'ACTIVE' },
  ]);

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minOrder: '',
    expiry: ''
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon = {
      id: `CPN-${Math.floor(100 + Math.random() * 900)}`,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: formData.type === 'PERCENTAGE' ? `${formData.value}%` : `₹${formData.value}`,
      minOrder: `₹${formData.minOrder}`,
      expiry: formData.expiry,
      usage: 0,
      status: 'ACTIVE'
    };
    setCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
    setFormData({ code: '', type: 'PERCENTAGE', value: '', minOrder: '', expiry: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search coupons..." 
            className="bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium w-full md:w-96 text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-[#FF6A00] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <Plus size={18} /> Create Coupon
          </button>
          <ExportButtons data={coupons} fileName="coupons_list" title="Promotional Coupons Report" />
        </div>
      </div>

      <DataTable 
        headers={['Coupon Code', 'Type', 'Value', 'Min Order', 'Expiry', 'Usage', 'Status', 'Actions']}
        data={coupons}
        renderRow={(cpn, i) => (
          <tr key={i} className="group hover:bg-white/[0.02] transition-all">
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Ticket size={18} />
                </div>
                <span className="text-xs font-black text-white tracking-widest uppercase">{cpn.code}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cpn.type}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{cpn.value}</span>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-bold text-slate-400">{cpn.minOrder}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar size={14} />
                <span className="text-xs font-bold">{cpn.expiry}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black text-white">{cpn.usage}</span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                cpn.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {cpn.status}
              </span>
            </td>
            <td className="px-8 py-6">
              <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                <MoreVertical size={18} />
              </button>
            </td>
          </tr>
        )}
      />

      {/* Create Coupon Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create Promo Coupon"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coupon Code</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                required
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="e.g. SAVE50"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Discount Type</label>
              <div className="flex gap-4">
                {['PERCENTAGE', 'FIXED'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, type})}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.type === type 
                        ? 'bg-[#FF6A00]/10 border-[#FF6A00] text-[#FF6A00]' 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Discount Value</label>
              <div className="relative">
                {formData.type === 'PERCENTAGE' ? (
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                ) : (
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                )}
                <input 
                  required
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  placeholder={formData.type === 'PERCENTAGE' ? 'e.g. 50' : 'e.g. 100'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min Order Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="number" 
                  value={formData.minOrder}
                  onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                  placeholder="e.g. 200"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="date" 
                  value={formData.expiry}
                  onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-[#FF6A00]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-5 bg-[#FF6A00] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Check size={18} /> Create Coupon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Coupons;
