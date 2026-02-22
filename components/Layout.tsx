
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router';
import { Home, ShoppingBag, User, QrCode, ClipboardList } from 'lucide-react';
import { useApp } from '../App';

export const Layout: React.FC = () => {
  const { cart, designConfig } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: QrCode, label: 'Scan', path: '/scan', isSpecial: true },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const hideMobileNav = location.pathname.includes('/orders/') && !location.pathname.endsWith('/orders');

  return (
    <div className="flex flex-col h-full w-full overflow-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--brand-bg)' }}>
      <main className="flex-1 w-full max-w-4xl mx-auto overflow-hidden relative">
        <div id="main-content" className="h-full w-full overflow-y-auto overflow-x-hidden pt-0 no-scrollbar">
          <Outlet />
        </div>
      </main>

      {!hideMobileNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-[2000] bg-white/95 backdrop-blur-3xl border-t border-gray-100 pb-safe shadow-[0_-15px_40px_rgba(0,0,0,0.04)] rounded-t-[32px]">
          <div className="max-w-4xl mx-auto grid grid-cols-5 h-[72px] relative px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center h-full no-underline outline-none group"
              >
                {({ isActive }) => (
                  <div className={`
                    flex flex-col items-center w-full transition-all duration-300
                    ${isActive ? 'opacity-100' : 'opacity-40'}
                  `}>
                    <div className={`
                      flex items-center justify-center transition-all duration-500
                      ${item.isSpecial 
                        ? `text-white w-[54px] h-[54px] rounded-[18px] shadow-xl z-[2100] absolute -top-7 border-[4px] border-white active:scale-90` 
                        : `text-gray-900`
                      }
                    `} style={{ 
                      backgroundColor: item.isSpecial ? designConfig.primaryColor : 'transparent',
                      color: !item.isSpecial && isActive ? designConfig.primaryColor : undefined
                    }}>
                      <item.icon 
                        size={item.isSpecial ? 22 : 20} 
                        strokeWidth={isActive || item.isSpecial ? 3 : 2} 
                      />
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute top-0 right-0 text-white text-[8px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold border-2 border-white" style={{ backgroundColor: designConfig.primaryColor }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`
                      text-[10px] font-bold uppercase tracking-wider mt-1 transition-all duration-300
                      ${item.isSpecial ? 'opacity-0' : 'opacity-100'}
                    `} style={{ color: isActive ? designConfig.primaryColor : '#94A3B8' }}>
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};
