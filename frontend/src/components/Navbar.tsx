import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-[#0a1628] border-b border-white/10 px-6 py-4 flex justify-between items-center flex-wrap gap-4">
      <Link to="/deposit" className="text-xl font-bold text-white tracking-wide">
        💎 BlueMarble
      </Link>
      <div className="flex gap-6 items-center flex-wrap">
        <Link to="/deposit" className="text-white/70 hover:text-white transition text-sm">Deposit</Link>
        <Link to="/withdraw" className="text-white/70 hover:text-white transition text-sm">Withdraw</Link>
        <Link to="/buy" className="text-white/70 hover:text-white transition text-sm">Buy</Link>
        <Link to="/notifications" className="text-white/70 hover:text-white transition text-sm">Notifications</Link>
        <span className="text-white/50 text-sm">👤 {user.name}</span>
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;