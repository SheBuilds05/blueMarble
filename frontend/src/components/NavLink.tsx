import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, User, PhoneCall } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/withdraw', icon: <CreditCard size={24} />, label: 'Withdraw' },
    { path: '/profile', icon: <User size={24} />, label: 'Profile' },
    { path: '/contact', icon: <PhoneCall size={24} />, label: 'Contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#121212]/95 backdrop-blur-md border-t border-gray-800 px-6 py-3 pb-6 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#0033A0]' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;