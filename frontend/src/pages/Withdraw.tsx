import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';

interface Account {
  _id: string;
  type: string;
  balance: number;
  mask: string;
}

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAcc, setSelectedAcc] = useState<Account | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch User Accounts
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setAccounts(data.accounts);
        if (data.accounts.length > 0) setSelectedAcc(data.accounts[0]);
      });
  }, []);

  // 2. Perform Withdrawal
  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    setError(null);
    setSuccess(null);

    if (!selectedAcc || !value || value <= 0) {
      setError('Please select an account and enter a valid amount.');
      return;
    }

    if (value > selectedAcc.balance) {
      setError('Insufficient funds in the selected account.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          accountId: selectedAcc._id,
          amount: value
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state to reflect new balance
        setAccounts(prev => prev.map(acc => 
          acc._id === selectedAcc._id ? { ...acc, balance: data.newBalance } : acc
        ));
        setSelectedAcc(prev => prev ? { ...prev, balance: data.newBalance } : null);
        
        setSuccess(`R${value.toFixed(2)} withdrawn successfully.`);
        setAmount('');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Transaction failed.");
      }
    } catch (err) {
      setError("Server connection error.");
    }
  };

  return (
    <div className="min-h-screen w-full pb-32 overflow-x-hidden" style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}>
      <div className="flex items-center gap-4 px-6 py-8 md:px-12 mb-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Withdraw Funds</h1>
      </div>

      <main className="space-y-8 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Account Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map(acc => (
            <div 
              key={acc._id}
              onClick={() => setSelectedAcc(acc)}
              className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                selectedAcc?._id === acc._id 
                ? 'bg-white border-white shadow-xl scale-105' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                 <Wallet size={20} className={selectedAcc?._id === acc._id ? 'text-[#052ce0]' : 'text-white'} />
                 <span className={`text-[10px] font-black uppercase tracking-widest ${selectedAcc?._id === acc._id ? 'text-slate-400' : 'text-white/50'}`}>
                   {acc.mask}
                 </span>
              </div>
              <p className={`text-xs font-bold uppercase ${selectedAcc?._id === acc._id ? 'text-[#052ce0]' : 'text-white'}`}>{acc.type}</p>
              <h3 className={`text-xl font-black ${selectedAcc?._id === acc._id ? 'text-slate-900' : 'text-white'}`}>
                R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          ))}
        </div>

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

          {error && <div className="p-5 bg-red-500/20 border border-red-500/30 rounded-3xl text-red-100 text-sm font-bold flex items-center gap-3"><AlertCircle size={20}/> {error}</div>}
          {success && <div className="p-5 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl text-emerald-100 text-sm font-bold flex items-center gap-3"><CheckCircle2 size={20}/> {success}</div>}

          <button onClick={handleWithdraw} className="w-full bg-[#052ce0] hover:brightness-110 text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(5,46,224,0.3)] active:scale-95 transition-all mt-4">
            Confirm Withdrawal
          </button>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;