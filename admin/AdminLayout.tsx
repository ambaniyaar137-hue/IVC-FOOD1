
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, UtensilsCrossed, Bike, 
  ShoppingBag, Settings, LogOut, Menu, X,
  Bell, Search, User
} from 'lucide-react';
import { useApp } from '../App';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { designConfig } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: UtensilsCrossed, label: 'Restaurants', path: '/admin/restaurants' },
    { icon: Bike, label: 'Riders', path: '/admin/riders' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] font-['Plus_Jakarta_Sans'] overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        bg-white dark:bg-slate-900 border-r dark:border-slate-800 transition-all duration-300 flex flex-col z-[3000]
      `}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <UtensilsCrossed className="text-white" size={20} />
              </div>
              <span className="font-black text-xl tracking-tighter dark:text-white">HUNGER<span className="text-orange-500">FOOD</span></span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto cursor-pointer" onClick={() => navigate('/')}>
              <UtensilsCrossed className="text-white" size={20} />
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                  {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-slate-800">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm tracking-tight">Exit Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-8 z-[2000]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-12 pr-6 text-sm font-medium w-64 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 relative">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1.5 pr-4 rounded-2xl">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                <User size={16} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black tracking-tight dark:text-white">Admin Panel</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Superuser</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] dark:bg-[#0F172A]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
