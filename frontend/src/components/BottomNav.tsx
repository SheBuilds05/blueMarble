import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Wallet, History, CreditCard, User, Plus, 
  ArrowDownCircle, ArrowUpCircle, Banknote, ShoppingBag, X 
} from 'lucide-react';

const BottomNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    { label: 'Deposit', icon: <ArrowDownCircle size={20} />, path: '/deposit', color: 'bg-emerald-500' },
    { label: 'Withdraw', icon: <ArrowUpCircle size={20} />, path: '/withdraw', color: 'bg-blue-600' },
    { label: 'Pay Bills', icon: <Banknote size={20} />, path: '/pay', color: 'bg-indigo-600' },
    { label: 'Buy', icon: <ShoppingBag size={20} />, path: '/buy', color: 'bg-violet-600' },
  ];

  const handleAction = (path: string) => {
    setShowMenu(false);
    navigate(path);
  };

  /**
   * CORRECTED NAV ITEMS:
   * - ACCOUNT now goes to '/accounts'
   * - CARDS now goes to '/cards'
   */
  const navItems = [
    { path: '/dashboard', icon: <Wallet size={22} />, label: 'HOME' },
    { path: '/accounts', icon: <User size={22} />, label: 'ACCOUNT' },
    { path: '/history', icon: <History size={22} />, label: 'HISTORY' },
    { path: '/cards', icon: <CreditCard size={22} />, label: 'CARDS' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-8 z-[99999] pointer-events-none">
      
      {/* Quick Actions Menu */}
      {showMenu && (
        <div 
          ref={menuRef}
          className="mb-6 w-[92%] max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/40 pointer-events-auto animate-in fade-in slide-in-from-bottom-10 duration-300"
        >
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#052ce0]">Quick Actions</h3>
            <button onClick={() => setShowMenu(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleAction(action.path)}
                className="flex items-center gap-4 p-4 rounded-3xl bg-white/50 border border-white/80 hover:bg-[#052ce0] hover:text-white transition-all group shadow-sm active:scale-95"
              >
                <div className={`p-2 rounded-2xl ${action.color} text-white group-hover:bg-white group-hover:text-[#052ce0] transition-colors`}>
                  {action.icon}
                </div>
                <span className="text-sm font-bold tracking-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-2xl border border-white/40 h-20 w-[92%] max-w-md rounded-[2.5rem] flex justify-between items-center px-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative pointer-events-auto">
        
        <div className="flex flex-1 justify-around items-center h-full">
          <CustomNavLink item={navItems[0]} />
          <CustomNavLink item={navItems[1]} />
        </div>

        {/* Center Toggle Button */}
        <div className="relative -top-8 mx-2">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(5,46,192,0.5)] border-4 border-white transition-all duration-500 transform ${showMenu ? 'bg-slate-800 rotate-45' : 'bg-[#052ce0]'}`}
          >
            <Plus size={32} color="white" strokeWidth={3} />
          </button>
        </div>

        <div className="flex flex-1 justify-around items-center h-full">
          <CustomNavLink item={navItems[2]} />
          <CustomNavLink item={navItems[3]} />
        </div>
      </nav>

      {/* Slogan Label */}
      <div className="mt-3 pointer-events-none">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] drop-shadow-sm">
          blueMarble
        </span>
      </div>
    </div>
  );
};

const CustomNavLink = ({ item }: { item: any }) => (
  <NavLink 
    to={item.path}
    className={({ isActive }) => `
      relative flex flex-col items-center justify-center gap-1 w-16 h-full rounded-2xl transition-all duration-300
      ${isActive ? 'bg-[#ADE8F4]/30' : 'active:bg-gray-100'}
    `}
  >
    {({ isActive }) => (
      <>
        <div className={`${isActive ? 'text-[#052ce0] scale-110' : 'text-slate-400'} transition-all`}>
          {item.icon}
        </div>
        <span className={`text-[9px] font-black tracking-tighter uppercase ${isActive ? 'text-[#052ce0]' : 'text-slate-500'}`}>
          {item.label}
        </span>
        {isActive && (
          <div className="absolute bottom-2 w-1.5 h-1.5 bg-[#052ce0] rounded-full shadow-[0_0_8px_#052ce0]" />
        )}
      </>
    )}
  </NavLink>
);

export default BottomNav;
