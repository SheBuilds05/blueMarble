import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Receipt, 
  History as HistoryIcon, 
  Bell, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Deposit', path: '/deposit', icon: <ArrowDownCircle size={18} /> },
    { name: 'Withdraw', path: '/withdraw', icon: <ArrowUpCircle size={18} /> },
    { name: 'Pay Bills', path: '/pay', icon: <Receipt size={18} /> },
    { name: 'History', path: '/history', icon: <HistoryIcon size={18} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#0a1628] border-b border-white/10 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#052ce0] to-[#3b82f6] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-xl">💎</span>
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              Blue<span className="text-[#052ce0]">Marble</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-[#052ce0] text-white shadow-md shadow-[#052ce0]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Welcome</span>
              <span className="text-sm font-bold text-white uppercase">{user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all group"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:-rotate-12 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-white/70 hover:text-white bg-white/5"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0d1b2e] border-t border-white/5 px-4 py-6 space-y-2 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-[#052ce0] text-white'
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
