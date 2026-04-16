import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, Bell, Settings, Plus, ArrowUpRight, Banknote, 
  ArrowDownCircle, ArrowUpCircle, ShoppingBag, 
  Home as HomeIcon, User, History, PhoneCall, MessageCircle, CreditCard
} from 'lucide-react';

// Path matches your assets folder

import BottomNav from '../components/BottomNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, name: 'Apple Store', date: 'Today, 2:45 PM', price: '-$1,299.00', type: 'out', category: 'TECH' },
    { id: 2, name: 'Salary Deposit', date: 'Yesterday', price: '+$4,500.00', type: 'in', category: 'WORK' },
    { id: 3, name: 'Electric Bill', date: 'Oct 12, 2023', price: '-$84.50', type: 'out', category: 'UTILITIES' },
  ];

  const actions = [
    { label: 'Pay Bills', icon: <Banknote size={24} />, path: '/pay' },
    { label: 'Deposit', icon: <ArrowDownCircle size={24} />, path: '/deposit' },
    { label: 'Withdraw', icon: <ArrowUpCircle size={24} />, path: '/withdraw' },
    { label: 'Buy', icon: <ShoppingBag size={24} />, path: '/buy' }, 
    { label: 'Message', icon: <MessageCircle size={24} />, path: '/notification' },
    { label: 'Contact Us', icon: <PhoneCall size={24} />, path: '/contact' },
  ];

  return (
    /* FIXED: Removed max-w-5xl and added w-full for full-screen edge-to-edge layout */
    <div className="min-h-screen w-full bg-linear-to-br from-[#052ce0] to-[#ADE8F4] pb-44 overflow-x-hidden">
      
      {/* Header - Added padding here instead of the main wrapper */}
      <header className="flex justify-between items-center px-6 py-8 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-xl shadow-lg border border-white/20 bg-white">
            <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
            blue<span className="font-light">Marble</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#ADE8F4]"></span>
          </button>
          <button onClick={() => navigate('/settings')} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-colors">
            <Settings size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl border-2 border-white/40 overflow-hidden cursor-pointer shadow-sm ml-1" onClick={() => navigate('/profile')}>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="profile" />
          </div>
        </div>
      </header>

      {/* Main content area with horizontal padding to keep elements off the screen edges */}
      <main className="space-y-10 px-6 md:px-12">
        
        {/* Platinum Card Section */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/50 w-full">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-[#052ce0] font-black text-[10px] tracking-[0.3em] uppercase opacity-60">Platinum Member</p>
              <h3 className="text-2xl font-bold text-[#052ce0] mt-1 italic">Deolyn East</h3>
            </div>
            <div className="w-14 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg shadow-inner opacity-80" />
          </div>
          <div className="flex justify-between items-end">
            <p className="text-[#052ce0]/70 font-mono tracking-widest text-lg">**** **** **** 4717</p>
            <CreditCard className="text-[#052ce0]/20" size={40} />
          </div>
        </div>

        {/* Balance Card - Total Net Worth */}
        <div className="bg-[#ADE8F4]/30 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden w-full">
          <p className="text-white/80 uppercase tracking-widest text-[10px] font-black mb-2">Total Net Worth</p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-10 drop-shadow-lg">$124,592.00</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/deposit')}
              className="bg-[#052ce0] hover:brightness-110 text-white px-10 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <Plus size={18} /> Add Money
            </button>
            <button 
              onClick={() => navigate('/withdraw')}
              className="bg-white/20 hover:bg-white/30 text-white px-10 py-4 rounded-2xl font-bold border border-white/30 flex items-center gap-2 active:scale-95 transition-all backdrop-blur-md"
            >
              <ArrowUpRight size={18} /> Transfer
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <button 
              key={index}
              onClick={() => action.path !== '#' ? navigate(action.path) : alert("Service coming soon")}
              className="bg-[#ADE8F4]/20 backdrop-blur-lg border border-white/30 p-8 rounded-[2rem] flex flex-col items-center gap-3 hover:bg-[#ADE8F4]/30 active:scale-95 transition-all group shadow-lg"
            >
              <div className="text-[#052ce0] group-hover:scale-110 transition-transform drop-shadow-sm p-3 bg-white/20 rounded-2xl">
                {action.icon}
              </div>
              <span className="font-bold text-sm text-white tracking-wide">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Accounts Section */}
        <section>
          <h3 className="text-lg font-bold text-white mb-6 drop-shadow-md px-2">Your Accounts</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <div className="min-w-[280px] flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem]">
              <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Savings Account</p>
              <p className="text-white font-bold text-2xl">R82,400.00</p>
            </div>
            <div className="min-w-[280px] flex-1 bg-[#052ce0]/40 backdrop-blur-md border border-white/20 p-8 rounded-[2rem]">
              <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Business Account</p>
              <p className="text-white font-bold text-2xl">R42,192.00</p>
            </div>
          </div>
        </section>

        {/* Brand Slogan Footer */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/30" />
            <span className="text-[14px] font-black text-white/60 uppercase tracking-[0.4em]">blueMarble</span>
            <div className="h-[1px] w-12 bg-white/30" />
          </div>
          <p className="text-sm md:text-base text-white font-semibold italic tracking-wide drop-shadow-sm">
            "Your World, Your Bank, Your Freedom."
          </p>
        </div>

        {/* Transactions Section */}
        <section>
          <div className="mb-6 flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-white drop-shadow-md">Recent Activity</h3>
            <button onClick={() => navigate('/history')} className="text-xs font-black text-[#052ce0] bg-[#ADE8F4] px-4 py-2 rounded-full hover:brightness-105 transition-all shadow-md">SEE ALL</button>
          </div>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-6 bg-[#ADE8F4]/20 backdrop-blur-md border border-white/20 rounded-[2rem] cursor-pointer hover:bg-[#ADE8F4]/30 transition-all shadow-lg"
                onClick={() => navigate('/history')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-[#052ce0] shadow-inner">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{tx.name}</p>
                    <p className="text-xs text-white/60 font-bold uppercase tracking-tight">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${tx.type === 'in' ? 'text-emerald-300' : 'text-white'}`}>{tx.price}</p>
                  <p className="text-[10px] font-black text-[#052ce0] bg-[#ADE8F4]/70 px-3 py-1 rounded-lg uppercase tracking-widest mt-1">{tx.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav/>
    </div>
  );
};

export default Dashboard;
