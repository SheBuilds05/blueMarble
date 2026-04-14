import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, Bell, Settings, Plus, ArrowUpRight, Banknote, 
  ArrowDownCircle, ArrowUpCircle, ShoppingBag 
} from 'lucide-react';

// FIX: Ensure the path matches exactly. 
// If your file has spaces or parentheses, it's safer to rename the actual file 
// to 'logo.png' in your assets folder.
import logo from "../assets/logo.png";
const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, name: 'Apple Store', date: 'Today, 2:45 PM', price: '-$1,299.00', type: 'out', category: 'TECH' },
    { id: 2, name: 'Salary Deposit', date: 'Yesterday', price: '+$4,500.00', type: 'in', category: 'WORK' },
    { id: 3, name: 'Electric Bill', date: 'Oct 12, 2023', price: '-$84.50', type: 'out', category: 'UTILITIES' },
  ];

  const actions = [
    { label: 'Pay Bills', icon: <Banknote size={24} />, path: '/deposit' },
    { label: 'Deposit', icon: <ArrowDownCircle size={24} />, path: '/deposit' },
    { label: 'Withdraw', icon: <ArrowUpCircle size={24} />, path: '/withdraw' },
    { label: 'Buy', icon: <ShoppingBag size={24} />, path: '#' }, 
  ];

  return (
    <div className="min-h-screen px-6 py-8 md:px-12 max-w-5xl mx-auto pb-32">
      
      {/* Updated Header with Logo */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-xl shadow-lg border border-white/20 bg-white">
            <img 
              src={logo} // FIX: 'logo' is now being read here, resolving ts(6133)
              alt="blueMarble Logo" 
              className="w-full h-full object-contain p-1"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            blue<span className="font-light">Marble</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("No new notifications")}
            className="p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#ADE8F4]"></span>
          </button>

          <button 
            onClick={() => navigate('/settings')}
            className="p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-colors"
          >
            <Settings size={18} />
          </button>

          <div 
            className="w-10 h-10 rounded-xl border-2 border-white/40 overflow-hidden cursor-pointer shadow-sm ml-1"
            onClick={() => navigate('/profile')}
          >
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" 
              className="w-full h-full object-cover" 
              alt="profile" 
            />
          </div>
        </div>
      </header>

      <main>
        {/* Balance Card */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-xl mb-10 text-center relative overflow-hidden">
          <p className="text-white/70 uppercase tracking-widest text-[10px] font-black mb-2">Total Net Worth</p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-10">$124,592.00</h2>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/deposit')}
              className="bg-[#052ec0] hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
            >
              <Plus size={18} /> Add Money
            </button>
            <button 
              onClick={() => navigate('/withdraw')}
              className="bg-white/20 hover:bg-white/30 text-white px-10 py-4 rounded-2xl font-bold border border-white/30 flex items-center gap-2 active:scale-95 transition-transform"
            >
              <ArrowUpRight size={18} /> Transfer
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          {actions.map((action, index) => (
            <button 
              key={index}
              onClick={() => action.path !== '#' ? navigate(action.path) : alert("Service coming soon")}
              className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-[2rem] flex flex-col items-center gap-3 hover:bg-white/30 active:scale-95 transition-all group shadow-lg"
            >
              <div className="text-[#052ec0] group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="font-bold text-sm text-white">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Brand Slogan */}
        <div className="text-center mt-12 mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-[14px] font-black text-white/50 uppercase tracking-[0.4em]">
              blueMarble
            </span>
            <div className="h-[1px] w-12 bg-white/20" />
          </div>
          <p className="text-sm md:text-base text-white/80 font-semibold italic tracking-wide">
            "Your World, Your Bank, Your Freedom."
          </p>
        </div>

        {/* Transactions List */}
        <div className="mb-6 flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <button onClick={() => navigate('/history')} className="text-xs font-bold text-[#052ec0] hover:underline">See All &gt;</button>
        </div>
        
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-5 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl cursor-pointer hover:bg-white/30"
              onClick={() => navigate('/history')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-[#052ec0]">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">{tx.name}</p>
                  <p className="text-[10px] text-white/50 font-bold uppercase">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${tx.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>{tx.price}</p>
                <p className="text-[9px] font-black text-[#052ec0]/40 uppercase tracking-widest">{tx.category}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;