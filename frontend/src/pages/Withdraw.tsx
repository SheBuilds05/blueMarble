import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
 
const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [localBalance, setLocalBalance] = useState<number>(12450.00);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  const handleWithdraw = () => {
    const value = parseFloat(amount);
    setSuccess(null);
    setError(null);
    if (!value || value <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (value > localBalance) {
      setError('Insufficient funds.');
      return;
    }
    setLocalBalance(prev => prev - value);
    setSuccess(`R${value.toFixed(2)} withdrawn successfully.`);
    setAmount('');
    setTimeout(() => setSuccess(null), 3000);
  };
 
  return (
    <div
      className="min-h-screen px-6 py-8 md:px-12 max-w-2xl mx-auto pb-32"
      style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">Withdraw Funds</h1>
      </div>
 
      <main className="space-y-8">
        {/* Balance Card - Matching Dashboard Style */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
          <p className="text-white/70 uppercase tracking-widest text-[10px] font-black mb-2">Available Balance</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            R {localBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </h2>
          <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full border border-white/10">
            <p className="text-[10px] text-white font-bold uppercase tracking-wider">
              Savings Account •••• 4453
            </p>
          </div>
        </div>
 
        {/* Feedback Messages */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl text-emerald-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
 
        {/* Input Section */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-[2.5rem] shadow-lg space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] ml-2">
              Amount to Withdraw
            </label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#052ce0]">R</span>
              <input
                type="number"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(null); }}
                className="w-full bg-white/40 border-2 border-white/20 rounded-3xl py-6 pl-14 pr-6 text-3xl font-bold text-white placeholder-white/30 outline-none focus:border-white/60 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
 
          {/* Quick Amount Grid */}
          <div className="grid grid-cols-3 gap-3">
            {['100', '200', '500'].map(val => (
              <button
                key={val}
                onClick={() => { setAmount(val); setError(null); }}
                className={`py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 border ${
                  amount === val
                  ? 'bg-white text-[#052ce0] border-white shadow-lg'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                R {val}
              </button>
            ))}
          </div>
 
          {/* Action Button */}
          <button
            onClick={handleWithdraw}
            className="w-full bg-[#052ce0] hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-900/20 active:scale-95 transition-all mt-4"
          >
            Confirm Withdrawal
          </button>
        </div>
 
        {/* Enlarged Brand Slogan Integration */}
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
      </main>
    </div>
  );
};
 
export default Withdraw;