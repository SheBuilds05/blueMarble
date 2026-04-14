import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, History, CreditCard, User, Plus } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/dashboard', icon: <Wallet size={22} />, label: 'HOME' },
    { path: '/profile', icon: <User size={22} />, label: 'ACCOUNT' },
    { path: '/history', icon: <History size={22} />, label: 'HISTORY' },
    { path: '/withdraw', icon: <CreditCard size={22} />, label: 'CARDS' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
      {/* Background is now more solid (bg-white/90) for better readability against the gradient */}
      <nav className="bg-white/95 backdrop-blur-md border border-white/20 h-20 rounded-[2.5rem] flex justify-between items-center px-4 shadow-2xl relative">
        
        {/* Left Nav Group */}
        <div className="flex flex-1 justify-around items-center">
          <CustomNavLink item={navItems[0]} />
          <CustomNavLink item={navItems[1]} />
        </div>

        {/* Center Floating Action - High Contrast Blue */}
        <div className="relative -top-6 mx-2">
          <NavLink to="/deposit">
            <button className="w-16 h-16 bg-[#052ec0] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40 border-4 border-white hover:scale-110 transition-transform active:scale-95">
              <Plus size={32} color="white" strokeWidth={3} />
            </button>
          </NavLink>
        </div>

        {/* Right Nav Group */}
        <div className="flex flex-1 justify-around items-center">
          <CustomNavLink item={navItems[2]} />
          <CustomNavLink item={navItems[3]} />
        </div>
        
      </nav>
    </div>
  );
};

const CustomNavLink = ({ item }: { item: any }) => (
  <NavLink 
    to={item.path}
    className={({ isActive }) => `
      relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300
      ${isActive ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50'}
    `}
  >
    {({ isActive }) => (
      <>
        <div className={`${isActive ? 'text-[#052ec0] scale-110' : 'text-gray-400'} transition-all duration-300`}>
          {item.icon}
        </div>
        <span className={`text-[9px] font-black tracking-tighter uppercase ${isActive ? 'text-[#052ec0]' : 'text-gray-500'}`}>
          {item.label}
        </span>
        
        {/* Active Dot Indicator */}
        {isActive && (
          <div className="absolute bottom-1 w-1 h-1 bg-[#052ec0] rounded-full shadow-[0_0_5px_#052ec0]" />
        )}
      </>
    )}
  </NavLink>
);

export default BottomNav;