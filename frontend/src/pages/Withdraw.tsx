import React, { useState } from 'react';

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  // Local dummy state to simulate the account
  const [localBalance, setLocalBalance] = useState<number>(12450.00);

  const handleWithdraw = () => {
    const value = parseFloat(amount);
    if (value > 0 && value <= localBalance) {
      setLocalBalance(prev => prev - value);
      setAmount('');
      alert(`Success! R${value} withdrawn.`);
    } else {
      alert("Invalid amount or insufficient funds.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Withdraw Funds</h1>

      <div className="bg-[#0033A0] rounded-3xl p-6 mb-10 shadow-lg border border-blue-400/20">
        <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold mb-1">Available Balance</p>
        <h2 className="text-4xl font-bold italic">R {localBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</h2>
        <p className="mt-6 text-sm text-blue-100/70 font-medium">Savings Account •••• 4453</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400">Amount to Withdraw</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-500">R</span>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#121212] border border-gray-800 rounded-2xl py-5 pl-12 pr-6 text-3xl font-bold focus:border-[#0033A0] focus:ring-1 focus:ring-[#0033A0] outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['100', '200', '500'].map((val) => (
            <button 
              key={val}
              onClick={() => setAmount(val)}
              className="bg-[#1A1A1A] py-4 rounded-xl border border-gray-800 font-semibold hover:border-[#0033A0] hover:bg-[#0033A0]/10 transition-all active:scale-95"
            >
              R {val}
            </button>
          ))}
        </div>

        <button 
          onClick={handleWithdraw}
          className="w-full bg-white text-black font-extrabold py-5 rounded-2xl mt-4 hover:bg-gray-200 active:scale-[0.98] transition-all text-lg"
        >
          Confirm Withdrawal
        </button>
      </div>
    </div>
  );
};

export default Withdraw;