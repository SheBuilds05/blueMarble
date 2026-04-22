import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Bell, Settings, Plus, ArrowUpRight, Banknote,
  ArrowDownCircle, ArrowUpCircle, ShoppingBag,
  PhoneCall, MessageCircle, Loader2
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
  const [userName, setUserName] = useState("User");
 
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
 
      try {
        // Fetch accounts directly from your auth/accounts route
        const response = await fetch(`http://localhost:5000/api/auth/accounts`, {
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
          // Calculate net worth dynamically
          const total = cleanedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
          setTotalBalance(total);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchDashboardData();
  }, [navigate]);
 
  const actions = [
    { label: 'Pay Bills', icon: <Banknote size={24} />, path: '/pay' },
    { label: 'Deposit', icon: <ArrowDownCircle size={24} />, path: '/deposit' },
    { label: 'Withdraw', icon: <ArrowUpCircle size={24} />, path: '/withdraw' },
    { label: 'Buy', icon: <ShoppingBag size={24} />, path: '/buy' },
    { label: 'Message', icon: <MessageCircle size={24} />, path: '/notification' },
    { label: 'Contact Us', icon: <PhoneCall size={24} />, path: '/contact' },
  ];
 
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#052ce0]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
 
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#052ce0] to-[#ADE8F4] pb-44 overflow-x-hidden">
     
      {/* Header */}
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
 
      <main className="space-y-10 px-6 md:px-12">
       
        {/* Balance Card - Total Net Worth */}
        <div className="bg-[#ADE8F4]/30 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden w-full">
          <p className="text-white/80 uppercase tracking-widest text-[10px] font-black mb-2">Total Net Worth</p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-10 drop-shadow-lg">
            R {totalBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </h2>
         
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/deposit')} className="bg-[#052ce0] hover:brightness-110 text-white px-10 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all">
              <Plus size={18} /> Add Money
            </button>
            <button onClick={() => navigate('/withdraw')} className="bg-white/20 hover:bg-white/30 text-white px-10 py-4 rounded-2xl font-bold border border-white/30 flex items-center gap-2 active:scale-95 transition-all backdrop-blur-md">
              <ArrowUpRight size={18} /> Transfer
            </button>
          </div>
        </div>
 
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="bg-[#ADE8F4]/20 backdrop-blur-lg border border-white/30 p-8 rounded-[2rem] flex flex-col items-center gap-3 hover:bg-[#ADE8F4]/30 active:scale-95 transition-all group shadow-lg"
            >
              <div className="text-[#052ce0] group-hover:scale-110 transition-transform drop-shadow-sm p-3 bg-white/20 rounded-2xl">
                {action.icon}
              </div>
              <span className="font-bold text-sm text-white tracking-wide">{action.label}</span>
            </button>
          ))}
        </div>
 
        {/* Accounts Section - Mapped from DB */}
        <section>
          <h3 className="text-lg font-bold text-white mb-6 drop-shadow-md px-2">Your Accounts</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {accounts.map((acc) => (
              <div key={acc.id} className="min-w-[280px] flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem]">
                <p className="text-white/60 text-[10px] font-bold uppercase mb-1">{acc.type} Account</p>
                <p className="text-white font-bold text-2xl">
                  R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-white/40 text-[11px] mt-2">{acc.name}</p>
              </div>
            ))}
          </div>
        </section>
 
        {/* Slogan */}
        <div className="text-center py-6">
          <p className="text-sm md:text-base text-white font-semibold italic tracking-wide drop-shadow-sm">
            "Your World, Your Bank, Your Freedom."
          </p>
        </div>
      </main>
 
      <BottomNav/>
    </div>
  );
};
 
export default Dashboard;
 