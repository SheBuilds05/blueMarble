import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Account {
  id: string; // Internal state uses 'id'
  _id?: string; // MongoDB original field
  type: string;
  balance: number;
  name: string;
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

  // FETCH ACCOUNTS ON LOAD
// Inside Withdraw.tsx

useEffect(() => {
  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/accounts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        const cleanedAccounts = data.map((acc: any) => ({
          ...acc,
          // Force use of the string 'id' shown in your object
          id: acc.id || acc._id, 
          balance: typeof acc.balance === 'string' 
            ? parseFloat(acc.balance.replace(/[^\d.-]/g, '')) 
            : acc.balance
        }));

        setAccounts(cleanedAccounts);

        // AUTO-SELECT for single-account users
        if (cleanedAccounts.length > 0) {
          setSelectedAccount(cleanedAccounts[0]);
        }
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  fetchAccounts();
}, []);

  const handleWithdraw = async () => {
    const token = localStorage.getItem('token');
    const value = parseFloat(amount);

    // 2. Validation
    if (!selectedAccount || !value || value <= 0) {
      setError('Please enter a valid amount and select an account.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 3. Updated fetch with Authorization Header
      const response = await fetch('http://localhost:5000/api/withdraw', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Fixed 401 Unauthorized
        },
        body: JSON.stringify({
          accountId: selectedAccount.id, // Ensure this matches the ID string in MongoDB
          amount: value
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`R${value.toFixed(2)} withdrawn from ${selectedAccount.name}`);
        
        // 4. Sync Local UI State
        const updatedBalance = data.newBalance;
        setAccounts(prev => prev.map(acc => 
          acc.id === selectedAccount.id ? { ...acc, balance: updatedBalance } : acc
        ));
        setSelectedAccount(prev => prev ? { ...prev, balance: updatedBalance } : null);
        
        setAmount('');
        setTimeout(() => setSuccess(null), 4000);
      } else {
        // Handle specific error messages from your withdrawals.ts
        setError(data.error || 'Withdrawal declined.');
      }
    } catch (err) {
      setError('Connection error. Try again later.');
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
    <div className="min-h-screen w-full pb-32" style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}>
      {/* HEADER */}
      <div className="flex items-center gap-4 px-6 py-8 max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/40">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
      </div>

      <main className="space-y-8 px-6 max-w-4xl mx-auto">
        {/* ACCOUNT SELECTOR */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => { setSelectedAccount(acc); setError(null); }}
              className={`min-w-[280px] p-6 rounded-[2.5rem] border transition-all text-left ${
                selectedAccount?.id === acc.id 
                  ? 'bg-white border-white scale-105 shadow-2xl' 
                  : 'bg-white/10 border-white/20 text-white'
              }`}
            >
              <p className={`text-[10px] font-black uppercase tracking-widest ${selectedAccount?.id === acc.id ? 'text-[#052ce0]/60' : 'opacity-60'}`}>
                {acc.type}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${selectedAccount?.id === acc.id ? 'text-[#052ce0]' : 'text-white'}`}>
                R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </h3>
              <p className={`text-[12px] mt-2 ${selectedAccount?.id === acc.id ? 'text-[#052ce0]/40' : 'opacity-40'}`}>
                {acc.name}
              </p>
            </button>
          ))}
        </div>

        {/* INPUT CARD */}
        <div className="bg-white/20 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[12px] font-black text-white uppercase tracking-widest ml-2">Amount to Withdraw</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#052ce0]">R</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/40 border-2 border-white/10 rounded-[2rem] py-6 pl-12 pr-6 text-3xl font-bold text-white outline-none placeholder:text-white/40 focus:bg-white/50 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={20}/> {error}
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 size={20}/> {success}
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={isSubmitting || !amount}
            className="w-full bg-[#052ce0] text-white py-6 rounded-[2rem] font-black text-xl flex justify-center items-center gap-3 hover:bg-[#0424b9] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Withdrawal'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;