import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Wallet, History, CreditCard, User, Plus } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <Wallet size={22} />, label: 'HOME' },
    { path: '/profile', icon: <User size={22} />, label: 'ACCOUNT' },
    { path: '/history', icon: <History size={22} />, label: 'HISTORY' },
    { path: '/withdraw', icon: <CreditCard size={22} />, label: 'CARDS' },
  ];

  return (
    /* Increased z-index to 9999 to ensure it sits above all dashboard elements */
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-[9999] pointer-events-auto">
      <nav className="bg-white/95 backdrop-blur-2xl border border-white/40 h-20 rounded-[2.5rem] flex justify-between items-center px-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
        
        {/* Left Nav Group */}
        <div className="flex flex-1 justify-around items-center">
          <CustomNavLink item={navItems[0]} />
          <CustomNavLink item={navItems[1]} />
        </div>

        {/* Center Floating Action - blueMarble Primary Blue */}
        <div className="relative -top-8 mx-2">
          <NavLink to="/deposit" className="block">
            <button 
              className="w-16 h-16 bg-[#052ec0] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(5,46,192,0.4)] border-4 border-white hover:scale-110 transition-transform active:scale-95 cursor-pointer"
              onClick={() => console.log("Navigating to Deposit")}
            >
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
      {/* Slogan Label under Nav as seen in your reference images */}
      <div className="text-center mt-2">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">blueMarble</span>
      </div>
    </div>
  );
};

const CustomNavLink = ({ item }: { item: any }) => (
  <NavLink 
    to={item.path}
    // Added pointer-events-auto and cursor-pointer to ensure clickability
    className={({ isActive }) => `
      relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300 cursor-pointer pointer-events-auto
      ${isActive ? 'bg-[#ADE8F4]/30 shadow-inner' : 'hover:bg-gray-50/50'}
    `}
  >
    {({ isActive }) => (
      <>
        <div className={`${isActive ? 'text-[#052ec0] scale-110' : 'text-gray-400'} transition-all duration-300 drop-shadow-sm`}>
          {item.icon}
        </div>
        <span className={`text-[9px] font-black tracking-tighter uppercase transition-colors duration-300 ${isActive ? 'text-[#052ec0]' : 'text-gray-500'}`}>
          {item.label}
        </span>
        
        {/* blueMarble Dot Indicator */}
        {isActive && (
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#052ec0] rounded-full shadow-[0_0_8px_#052ec0]" />
        )}
      </>
    )}
  </NavLink>
);

export default BottomNav;