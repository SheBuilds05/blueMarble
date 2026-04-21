<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Account {
  id: string;
  name: string;
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;
}

const Deposit = () => {
  const { user, addNotification } = useAuth();

  // Dummy accounts data (you can later replace with user?.accounts)
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Savings',
      type: 'savings',
      balance: 12500.75,
      accountNumber: 'SAV-****-1234',
    },
    {
      id: '2',
      name: 'Everyday Cheque',
      type: 'cheque',
      balance: 3450.50,
      accountNumber: 'CHQ-****-5678',
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 50000.00,
      accountNumber: 'INV-****-9012',
    },
  ]);

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccountId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Please select source and destination accounts', type: 'error' });
      return;
    }
    if (fromAccountId === toAccountId) {
      setMessage({ text: 'Cannot transfer to the same account', type: 'error' });
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: 'Enter a valid amount', type: 'error' });
      return;
    }
    if (numAmount > (fromAccount?.balance || 0)) {
      setMessage({ text: `Insufficient funds in ${fromAccount?.name}`, type: 'error' });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    setIsLoading(true);
    const numAmount = parseFloat(amount);
    setTimeout(() => {
      const updated = accounts.map(acc => {
        if (acc.id === fromAccountId) return { ...acc, balance: acc.balance - numAmount };
        if (acc.id === toAccountId) return { ...acc, balance: acc.balance + numAmount };
        return acc;
      });
      setAccounts(updated);
      addNotification({
        title: 'Transfer Successful',
        message: `${formatCurrency(numAmount)} transferred from ${fromAccount?.name} to ${toAccount?.name}`,
        type: 'transaction'
      });
      setMessage({ text: `Transferred ${formatCurrency(numAmount)} to ${toAccount?.name}`, type: 'success' });
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      setShowConfirmation(false);
      setTimeout(() => setMessage(null), 3000);
      setIsLoading(false);
    }, 800);
  };

  const cancelTransfer = () => setShowConfirmation(false);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a2a4a]">Transfer Funds</h1>
        <p className="text-gray-500">Move money between your accounts</p>
      </div>

      {/* Total balance */}
      <div className="max-w-md mx-auto mb-8 bg-white rounded-xl shadow p-4 text-center">
        <span className="text-gray-500 text-sm">Total balance</span>
        <div className="text-2xl font-bold text-[#1a2a4a]">{formatCurrency(totalBalance)}</div>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-[#052CE0]">
            <h3 className="font-semibold">{acc.name}</h3>
            <p className="text-gray-400 text-xs">{acc.accountNumber}</p>
            <p className="text-xl font-bold mt-2">{formatCurrency(acc.balance)}</p>
          </div>
        ))}
      </div>

      {/* Transfer form */}
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transfer Details</h2>
        {message && (
          <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <div className="space-y-4">
          <select
            value={fromAccountId}
            onChange={e => { setFromAccountId(e.target.value); setToAccountId(''); }}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">From account</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} – {formatCurrency(acc.balance)}</option>)}
          </select>
          <select
            value={toAccountId}
            onChange={e => setToAccountId(e.target.value)}
            disabled={!fromAccountId}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">To account</option>
            {availableToAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} – {formatCurrency(acc.balance)}</option>)}
          </select>
          <input
            type="number"
            placeholder="Amount (R)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Reference (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={handleTransfer}
            disabled={!fromAccountId || !toAccountId || !amount || isLoading}
            className="w-full bg-[#052CE0] text-white py-3 rounded-lg font-semibold hover:bg-[#052CE0]/90 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={cancelTransfer}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Confirm Transfer</h3>
            <div className="space-y-2 mb-4">
              <p><span className="text-gray-500">From:</span> {fromAccount?.name}</p>
              <p><span className="text-gray-500">To:</span> {toAccount?.name}</p>
              <p><span className="text-gray-500">Amount:</span> <span className="font-bold">{formatCurrency(parseFloat(amount))}</span></p>
              {description && <p><span className="text-gray-500">Ref:</span> {description}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={cancelTransfer} className="flex-1 py-2 border rounded-lg">Cancel</button>
              <button onClick={confirmTransfer} className="flex-1 py-2 bg-[#052CE0] text-white rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
>>>>>>> sibongokuhle
    </div>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default Deposit;
>>>>>>> sibongokuhle
