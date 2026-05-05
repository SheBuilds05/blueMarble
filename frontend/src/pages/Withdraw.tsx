import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Landmark } from 'lucide-react';

interface Account {
  id: string;
  _id?: string;
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

  useEffect(() => {
    const fetchAccounts = async () => {
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
          if (cleanedAccounts.length > 0) {
            setSelectedAccount(cleanedAccounts[0]);
          }
        }
      } catch (err) {
        setError('Security connection failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [navigate]);

  const handleWithdraw = async () => {
    const token = localStorage.getItem('token');
    const value = parseFloat(amount);

    if (!selectedAccount || !value || value <= 0) {
      setError('Enter a valid amount and select an origin account.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://bluemarble.onrender.com/api/withdraw', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          amount: value
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`R${value.toFixed(2)} successfully withdrawn from ${selectedAccount.name}`);
        const updatedBalance = data.newBalance;
        
        setAccounts(prev => prev.map(acc => 
          acc.id === selectedAccount.id ? { ...acc, balance: updatedBalance } : acc
        ));
        setSelectedAccount(prev => prev ? { ...prev, balance: updatedBalance } : null);
        
        setAmount('');
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError(data.error || 'Transaction declined by issuer.');
      }
    } catch (err) {
      setError('Connection timeout. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#002a8f]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-white animate-spin opacity-50" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Accessing Ledger</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#002a8f] text-white selection:bg-white selection:text-[#002a8f]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-12 max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="p-4 bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/10 hover:bg-white/20 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Withdraw</h1>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Liquidate Assets</p>
        </div>
      </div>

      <main className="space-y-10 px-6 max-w-4xl mx-auto pb-32">
        {/* ACCOUNT SELECTOR */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Select Source</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => { setSelectedAccount(acc); setError(null); }}
                className={`min-w-[280px] p-8 rounded-[3rem] border transition-all text-left relative overflow-hidden ${
                  selectedAccount?.id === acc.id 
                    ? 'bg-white border-white scale-105 shadow-2xl' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {selectedAccount?.id === acc.id && (
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#002a8f]/5 rounded-full blur-2xl" />
                )}
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedAccount?.id === acc.id ? 'text-[#002a8f]/40' : 'text-white/40'}`}>
                  {acc.type}
                </p>
                <h3 className={`text-2xl font-black mt-2 tracking-tighter ${selectedAccount?.id === acc.id ? 'text-[#002a8f]' : 'text-white'}`}>
                  R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </h3>
                <div className="flex items-center gap-2 mt-4">
                  <Landmark size={12} className={selectedAccount?.id === acc.id ? 'text-[#002a8f]/30' : 'text-white/20'} />
                  <p className={`text-[10px] font-bold uppercase tracking-tight ${selectedAccount?.id === acc.id ? 'text-[#002a8f]/60' : 'text-white/40'}`}>
                    {acc.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-4">Disbursement Amount</label>
            <div className="relative">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20">R</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/10 border-2 border-white/5 rounded-[2.5rem] py-8 pl-16 pr-8 text-4xl font-black text-white outline-none focus:border-white/20 focus:bg-white/15 transition-all placeholder:text-white/5"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} className="shrink-0"/> 
                <p className="text-[11px] font-black uppercase tracking-wide">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={20} className="shrink-0"/> 
                <p className="text-[11px] font-black uppercase tracking-wide">{success}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isSubmitting || !amount}
            className="w-full bg-white text-[#002a8f] py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] flex justify-center items-center gap-3 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Authorize Withdrawal'}
          </button>

          <p className="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
            Transactions are subject to security verification and daily limits.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;