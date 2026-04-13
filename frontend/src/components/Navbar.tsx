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
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/deposit">💎 BlueMarble</Link>
      </div>
      <div className="navbar-links">
        <Link to="/deposit">💰 Deposit</Link>
        <Link to="/buy">🛒 Buy</Link>
        <Link to="/notifications">🔔 Notifications</Link>
        <span className="user-name">👤 {user.name}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;