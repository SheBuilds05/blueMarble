import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, PhoneCall, ArrowUpRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dummy Data for the Dashboard
  const accountSummary = {
    name: "Rosa Novela",
    balance: "12,450.00",
    accNumber: "•••• 4453"
  };

  const actions = [
    { title: "Withdraw", icon: <CreditCard />, path: "/withdraw", color: "bg-blue-600" },
    { title: "Profile", icon: <User />, path: "/profile", color: "bg-teal-600" },
    { title: "Contact Us", icon: <PhoneCall />, path: "/contact", color: "bg-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <p className="text-gray-500 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold">{accountSummary.name}</h1>
        </div>
        <div className="w-12 h-12 bg-[#0033A0] rounded-full flex items-center justify-center font-bold">
          RN
        </div>
      </header>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-[#0033A0] to-blue-800 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-200 text-xs uppercase font-semibold">Total Balance</p>
          <h2 className="text-4xl font-bold mt-2">R {accountSummary.balance}</h2>
          <p className="text-blue-100/60 text-sm mt-8">{accountSummary.accNumber}</p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-gray-400 font-medium mb-2">Quick Actions</h3>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="flex items-center justify-between p-5 bg-[#1A1A1A] rounded-2xl border border-gray-800 hover:border-gray-600 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`${action.color} p-3 rounded-xl`}>
                    {React.cloneElement(action.icon as React.ReactElement, { size: 24 } as any)}
                  </div>
              <span className="text-lg font-semibold">{action.title}</span>
            </div>
            <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;