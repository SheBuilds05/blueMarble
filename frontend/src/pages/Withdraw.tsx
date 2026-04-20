import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Wallet } from 'lucide-react';

interface Account {
  _id: string;
  type: string;
  balance: number;
  mask?: string;
}

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');

  // 1. Fetch all user accounts on load
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/accounts/${userId}`);
        const data = await response.json();
        setAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0]); // Default to first account
      } catch (err) {
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAccounts();
  }, [userId]);

  // 2. Handle Backend Withdrawal
  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    setSuccess(null);
    setError(null);

    if (!selectedAccount) {
      setError('Please select an account.');
      return;
    }
    if (!value || value <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (value > selectedAccount.balance) {
      setError('Insufficient funds in the selected account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          accountId: selectedAccount._id,
          amount: value
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`R${value.toFixed(2)} withdrawn from ${selectedAccount.type}.`);
        setAmount('');
        // Update local state to reflect new balance
        setAccounts(prev => prev.map(acc => 
          acc._id === selectedAccount._id ? { ...acc, balance: data.newBalance } : acc
        ));
        setSelectedAccount(prev => prev ? { ...prev, balance: data.newBalance } : null);
        
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError(data.error || 'Withdrawal failed.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#052ce0]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen w-full pb-32 overflow-x-hidden" style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}>
      <div className="flex items-center gap-4 px-6 py-8 md:px-12 mb-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Withdraw Funds</h1>
      </div>

      <main className="space-y-8 px-6 md:px-12 max-w-4xl mx-auto">
        
        {/* Account Selector Horizontal Scroll */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white uppercase tracking-[0.3em] ml-2 opacity-80">Select Account</label>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {accounts.map((acc) => (
              <button
                key={acc._id}
                onClick={() => { setSelectedAccount(acc); setError(null); }}
                className={`min-w-[280px] p-6 rounded-[2rem] border transition-all text-left shadow-xl backdrop-blur-md ${
                  selectedAccount?._id === acc._id 
                  ? 'bg-white border-white scale-105 z-10' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg inline-block mb-4 ${selectedAccount?._id === acc._id ? 'bg-[#052ce0]/10 text-[#052ce0]' : 'bg-white/10 text-white'}`}>
                  <Wallet size={20} />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedAccount?._id === acc._id ? 'text-[#052ce0]/60' : 'text-white/60'}`}>
                  {acc.type} Account
                </p>
                <h3 className={`text-2xl font-bold ${selectedAccount?._id === acc._id ? 'text-[#052ce0]' : 'text-white'}`}>
                  R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="flex items-center gap-3 p-5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-3xl text-emerald-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-3xl text-red-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-10 rounded-[3rem] shadow-2xl space-y-8">
          <div className="space-y-4">
            <label className="text-[12px] font-black text-white uppercase tracking-[0.3em] ml-2 opacity-80">Amount to Withdraw</label>
            <div className="relative group">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-[#052ce0]">R</span>
              <input
                type="number"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(null); }}
                className="w-full bg-white/40 border-2 border-white/20 rounded-[2rem] py-8 pl-16 pr-8 text-4xl font-bold text-white placeholder-white/30 outline-none focus:border-white/60 focus:bg-white/50 transition-all shadow-inner"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {['100', '200', '500'].map(val => (
              <button
                key={val}
                onClick={() => { setAmount(val); setError(null); }}
                className={`py-5 rounded-2xl font-black text-base transition-all active:scale-95 border-2 shadow-md ${
                  amount === val ? 'bg-white text-[#052ce0] border-white shadow-xl' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                R {val}
              </button>
            ))}
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isSubmitting}
            className="w-full bg-[#052ce0] hover:brightness-110 text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(5,46,224,0.3)] active:scale-95 transition-all mt-4 flex justify-center items-center gap-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Withdrawal'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;