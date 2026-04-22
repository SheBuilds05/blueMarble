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
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <Link to="/deposit" className="text-xl font-bold text-[#052CE0]">BlueMarble</Link>
      <div className="flex gap-6 items-center">
        <Link to="/deposit" className="text-gray-600 hover:text-[#052CE0]">Deposit</Link>
        <Link to="/buy" className="text-gray-600 hover:text-[#052CE0]">Buy</Link>
        <Link to="/notifications" className="text-gray-600 hover:text-[#052CE0]">Notifications</Link>
        <span className="text-gray-400">|</span>
        <span className="text-sm text-gray-600">{user.name}</span>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;