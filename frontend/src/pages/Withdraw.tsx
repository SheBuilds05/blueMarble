import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

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
    /* FIXED: Removed max-w constraints and applied w-full for full-screen edge-to-edge layout */
    <div
      className="min-h-screen w-full pb-32 overflow-x-hidden"
      style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}
    >
      {/* Header - Horizontal padding applied here to align with Dashboard */}
      <div className="flex items-center gap-4 px-6 py-8 md:px-12 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Withdraw Funds</h1>
      </div>

      <main className="space-y-8 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Balance Card - Matching Dashboard Style */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden w-full">
          <p className="text-white/80 uppercase tracking-widest text-[10px] font-black mb-2">Available Balance</p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
            R {localBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </h2>
          <div className="inline-block px-6 py-2 bg-white/20 rounded-full border border-white/10 backdrop-blur-sm">
            <p className="text-[11px] text-white font-bold uppercase tracking-widest">
              Savings Account •••• 4453
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="flex items-center gap-3 p-5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-3xl text-emerald-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-3xl text-red-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-10 rounded-[3rem] shadow-2xl space-y-8">
          <div className="space-y-4">
            <label className="text-[12px] font-black text-white uppercase tracking-[0.3em] ml-2 opacity-80">
              Amount to Withdraw
            </label>
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

          {/* Quick Amount Grid */}
          <div className="grid grid-cols-3 gap-4">
            {['100', '200', '500'].map(val => (
              <button
                key={val}
                onClick={() => { setAmount(val); setError(null); }}
                className={`py-5 rounded-2xl font-black text-base transition-all active:scale-95 border-2 shadow-md ${
                  amount === val
                  ? 'bg-white text-[#052ce0] border-white shadow-xl scale-105'
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
            className="w-full bg-[#052ce0] hover:brightness-110 text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(5,46,224,0.3)] active:scale-95 transition-all mt-4"
          >
            Confirm Withdrawal
          </button>
        </div>

        {/* Brand Slogan Footer */}
        <div className="text-center py-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/30" />
            <span className="text-[14px] font-black text-white/60 uppercase tracking-[0.4em]">blueMarble</span>
            <div className="h-[1px] w-12 bg-white/30" />
          </div>
          <p className="text-sm md:text-base text-white font-semibold italic tracking-wide drop-shadow-sm">
            "Your World, Your Bank, Your Freedom."
          </p>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;