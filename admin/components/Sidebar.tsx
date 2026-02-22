
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UtensilsCrossed, Bike, 
  ShoppingBag, CreditCard, Ticket, Wallet, 
  Monitor, PieChart, Settings, LogOut 
} from 'lucide-react';
import { useApp } from '../../App';

const Sidebar: React.FC = () => {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: UtensilsCrossed, label: 'Restaurants', path: '/admin/restaurants' },
    { icon: Bike, label: 'Riders', path: '/admin/riders' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
    { icon: Wallet, label: 'Wallets', path: '/admin/wallets' },
    { icon: Monitor, label: 'Sessions', path: '/admin/sessions' },
    { icon: PieChart, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-[#070A11] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6A00] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <UtensilsCrossed className="text-white" size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">ADMIN<span className="text-[#FF6A00]">HUB</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group
              ${isActive 
                ? 'bg-[#FF6A00] text-white shadow-lg shadow-orange-500/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
