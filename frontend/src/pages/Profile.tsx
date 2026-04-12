import React from 'react';
import { User, Shield, Phone, Book, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  // Dummy User Data
  const user = {
    name: "Rosa Novela",
    role: "OpenBank Silver Member",
    initials: "RN"
  };

  const menuOptions = [
    { title: "ID details", icon: <Shield size={22} /> },
    { title: "Additional details", icon: <User size={22} /> },
    { title: "Contact details", icon: <Phone size={22} /> },
    { title: "Address book", icon: <Book size={22} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="mb-10 pt-6 flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#0033A0] to-blue-400 rounded-full mb-4 flex items-center justify-center text-3xl font-bold shadow-2xl">
          {user.initials}
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-blue-400 text-sm font-medium mt-1">{user.role}</p>
      </header>

      <div className="space-y-4 max-w-md mx-auto">
        {menuOptions.map((option, i) => (
          <button 
            key={i} 
            className="w-full flex items-center justify-between p-5 bg-[#161616] rounded-2xl border border-gray-900 hover:border-gray-700 transition-all group"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 mr-5">
                {option.icon}
              </div>
              <span className="text-lg font-medium text-gray-200">{option.title}</span>
            </div>
            <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile;