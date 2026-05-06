import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAccounts, transferFunds } from '../services/api';
import { ChevronLeft, X, ArrowRightLeft, Check, AlertCircle, Info } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface Account {
  _id: string;
  type: string;
  mask: string;
  balance: string;
  color: string;
}

const Deposit = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getUserAccounts();
        const data = Array.isArray(response.data) ? response.data : [];
        const validatedData = data.map((acc: any, index: number) => ({
          ...acc,
          _id: String(acc._id || acc.id || `account-key-${index}`)
        }));
        setAccounts(validatedData);
      } catch (err) {
        setError('Could not load account data.');
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Select both accounts', type: 'error' });
      return;
    }
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setMessage({ text: 'Enter a valid amount', type: 'error' });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setIsLoading(true);
    try {
      await transferFunds(fromAccountId, toAccountId, parseFloat(amount), reference);
      setMessage({ text: 'Transfer successful!', type: 'success' });
      setAmount('');
      setReference('');
      setShowConfirmation(false);
    } catch (error: any) {
      setMessage({ text: 'Transfer failed. Try again.', type: 'error' });
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#002a8f]/10 rounded-2xl" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Accounts</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* High-Contrast Header */}
      <nav className="bg-[#002a8f] p-8 pb-16 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-lg mx-auto flex justify-between items-center relative z-10">
          <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Payments</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Transfer</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
            <X size={24} />
          </button>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-10 relative z-20">
        {/* Transfer Interface */}
        <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,42,143,0.08)] border border-slate-100">
          
          {message && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <Check size={18}/> : <AlertCircle size={18}/>}
              <span className="text-xs font-black uppercase tracking-tight">{message.text}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* From Account */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Transfer From</label>
              <select 
                value={fromAccountId} 
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full bg-slate-50 border-none p-5 rounded-[2rem] text-sm font-bold text-[#000000] focus:ring-2 focus:ring-[#002a8f]/10 appearance-none"
              >
                <option value="">Select source account</option>
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>{acc.type} • {acc.balance}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center -my-4 relative z-10">
              <div className="bg-[#002a8f] text-white p-3 rounded-2xl shadow-lg rotate-90">
                <ArrowRightLeft size={20} />
              </div>
            </div>

            {/* To Account */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Transfer To</label>
              <select 
                value={toAccountId} 
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full bg-slate-50 border-none p-5 rounded-[2rem] text-sm font-bold text-[#000000] focus:ring-2 focus:ring-[#002a8f]/10 appearance-none"
              >
                <option value="">Select destination</option>
                {accounts.filter(acc => acc._id !== fromAccountId).map(acc => (
                  <option key={acc._id} value={acc._id}>{acc.type} ({acc.mask})</option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="pt-4 border-t border-slate-50">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Amount</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#002a8f] text-xl">R</span>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 p-6 pl-12 rounded-[2rem] text-3xl font-black text-[#000000] outline-none"
                />
              </div>
            </div>

            {/* Reference */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Reference</label>
              <input 
                type="text" 
                value={reference} 
                onChange={(e) => setReference(e.target.value)}
                placeholder="Internal Transfer"
                className="w-full bg-slate-50 p-5 rounded-[2rem] text-sm font-bold text-[#000000] outline-none"
              />
            </div>

            <button 
              onClick={handleTransfer}
              disabled={isLoading || !amount}
              className="w-full bg-[#002a8f] text-white p-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Review Transfer'}
            </button>
          </div>
        </div>

        {/* Brand Slogan */}
        <div className="text-center mt-12 opacity-30">
          <p className="text-[10px] font-black text-[#000000] uppercase tracking-[0.4em]">blueMarble Secure</p>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-[#001d66]/80 backdrop-blur-md flex items-end justify-center z-[10000] p-4">
          <div className="bg-white text-[#000000] w-full max-w-sm rounded-[3.5rem] p-10 relative animate-in slide-in-from-bottom-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-[#002a8f] border-b border-slate-50 pb-4">Confirm Details</h2>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">Amount</span>
                <span className="text-2xl font-black">R {amount}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">To</span>
                <span className="text-sm font-black uppercase">{accounts.find(a => a._id === toAccountId)?.type}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmation(false)} className="flex-1 bg-slate-100 text-slate-400 p-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px]">Cancel</button>
              <button onClick={confirmTransfer} className="flex-2 bg-[#002a8f] text-white p-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px]">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Deposit;