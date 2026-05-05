import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Bell, Settings, Plus, ArrowUpRight, Banknote,
  ArrowDownCircle, ArrowUpCircle, ShoppingBag,
  PhoneCall, MessageCircle, Loader2, ChevronRight, CreditCard,
  ShieldCheck, LogOut
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://bluemarble.onrender.com/api/auth/accounts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          const cleanedAccounts = data.map((acc: any) => ({
            ...acc,
            id: acc.id || acc._id,
            balance: typeof acc.balance === 'string'
              ? parseFloat(acc.balance.replace(/[^\d.-]/g, ''))
              : acc.balance
          }));

          setAccounts(cleanedAccounts);
          const total = cleanedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
          setTotalBalance(total);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#001d66]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-white animate-spin opacity-50" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Synchronizing Assets</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#001d66] text-white pb-32 font-sans selection:bg-white selection:text-[#001d66]">
      
      {/* Header */}
      <header className="w-full border-b border-white/5 bg-[#001d66]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
                  <img src="/Logo.png" alt="Logo" className="h-6 w-auto" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
                  BLUE<span className="font-light opacity-50">MARBLE</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              {/* Added Settings to Header */}
              <button 
                onClick={() => navigate('/settings')}
                className="text-white/40 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
              >
                <Settings size={22} strokeWidth={2} />
              </button>

              <button className="text-white/40 hover:text-white transition-all relative p-2 hover:bg-white/5 rounded-full">
                  <Bell size={22} strokeWidth={2} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#001d66]"></span>
              </button>

              <div 
                className="w-10 h-10 rounded-xl border border-white/10 p-0.5 overflow-hidden cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => navigate('/settings')}
              >
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-full h-full object-cover rounded-lg" alt="profile" />
              </div>
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* Liquidity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-end">
            <section className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <ShieldCheck size={14} className="text-blue-400" />
                  <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.4em]">Total Portfolio Value</p>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter flex items-baseline gap-4">
                    <span className="text-white/20 font-light text-4xl">R</span> 
                    {totalBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </h2>
            </section>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/deposit')} className="flex items-center justify-center gap-3 bg-white text-[#001d66] py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl active:scale-[0.97] hover:scale-[1.02]">
                    <Plus size={18} strokeWidth={4} /> Add Funds
                </button>
                <button onClick={() => navigate('/withdraw')} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all active:scale-[0.97]">
                    <ArrowUpRight size={18} strokeWidth={4} /> Transfer
                </button>
            </div>
        </div>

        {/* Ecosystem Grid */}
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Banking Ecosystem</p>
                <button 
                  onClick={() => navigate('/settings')} 
                  className="group flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black transition-all uppercase tracking-widest"
                >
                    <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Security & Settings
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  { label: 'Payments', icon: <Banknote size={24} />, path: '/pay', desc: 'Secure settlement' },
                  { label: 'Markets', icon: <ShoppingBag size={24} />, path: '/buy', desc: 'Global trading' },
                  { label: 'Concierge', icon: <PhoneCall size={24} />, path: '/contact', desc: 'Private support' },
                  { label: 'Portfolio', icon: <Settings size={24} />, path: '/settings', desc: 'Preferences' },
              ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigate(item.path)} 
                    className="bg-white p-8 rounded-[2.5rem] flex flex-col items-start gap-5 hover:bg-blue-50 transition-all group shadow-2xl border-none active:scale-[0.98]"
                  >
                      <div className="text-[#002a8f] bg-[#002a8f]/5 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="text-left space-y-1">
                          <span className="block text-sm font-black text-[#002a8f] uppercase tracking-wide">{item.label}</span>
                          <span className="text-[9px] text-[#002a8f]/40 font-black uppercase tracking-widest">{item.desc}</span>
                      </div>
                  </button>
              ))}
            </div>
        </div>

        {/* Assets Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Asset Allocation</p>
            <button className="text-[10px] text-blue-400 font-black hover:text-white uppercase tracking-widest transition-colors">Digital Statements</button>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            {accounts.map((acc) => (
              <div 
                key={acc.id} 
                onClick={() => navigate('/settings')}
                className="bg-[#002a8f] border border-white/5 p-8 rounded-[3rem] flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-white/20 cursor-pointer transition-all shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
                
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-[#001d66] rounded-[1.5rem] flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-105 transition-transform border border-white/5">
                    <CreditCard size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tight">{acc.name}</h4>
                    <p className="text-[10px] text-blue-300/40 font-black tracking-widest uppercase mt-1">
                        {acc.type} •••• {acc.id.slice(-4)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 md:mt-0 text-left md:text-right flex items-center gap-8 w-full md:w-auto justify-between md:justify-end relative z-10">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white tracking-tighter">
                        R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest md:text-right flex items-center gap-1 md:justify-end">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" /> Available Balance
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-full hidden md:block group-hover:bg-white group-hover:text-[#002a8f] transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-24 pb-8 text-center space-y-4">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="space-y-3 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">
                  BlueMarble Strategic Finance
                </p>
                <p className="text-[9px] text-white font-bold max-w-md mx-auto leading-relaxed uppercase tracking-tighter">
                  Authorized Financial Services Provider • © 2026
                </p>
            </div>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;