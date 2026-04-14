import React, { useState } from 'react';

const Withdraw: React.FC = () => {
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
    <div className="fixed inset-0 w-full h-full overflow-auto" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #93c5fd 100%)' }}>
      <div className="min-h-screen w-full p-6 md:p-10">
        <div className="max-w-lg mx-auto pt-6">
          <h1 className="text-3xl font-bold mb-8 tracking-tight">Withdraw funds</h1>

          {/* Balance card */}
          <div
            className="rounded-3xl p-7 mb-8 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
              border: '1px solid rgba(100,140,255,0.3)',
            }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Available balance
            </p>
            <h2 className="text-4xl font-bold italic">
              R {localBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </h2>
            <p className="mt-6 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Savings Account •••• 4453
            </p>
          </div>

          {/* Toast messages */}
          {success && (
            <div
              className="mb-5 px-5 py-3 rounded-2xl text-sm font-medium"
              style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.4)', color: '#86efac' }}
            >
              ✓ {success}
            </div>
          )}
          {error && (
            <div
              className="mb-5 px-5 py-3 rounded-2xl text-sm font-medium"
              style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5' }}
            >
              ✕ {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Amount to withdraw
              </label>
              <div className="relative">
                <span
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  R
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError(null); }}
                  className="w-full rounded-2xl py-5 pl-12 pr-6 text-3xl font-bold outline-none transition-all text-white"
                  placeholder="0.00"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                  }}
                  onFocus={e => (e.target.style.border = '1.5px solid rgba(255,255,255,0.6)')}
                  onBlur={e => (e.target.style.border = '1.5px solid rgba(255,255,255,0.2)')}
                />
              </div>
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-3 gap-3">
              {['100', '200', '500'].map(val => (
                <button
                  key={val}
                  onClick={() => { setAmount(val); setError(null); }}
                  className="py-4 rounded-2xl font-semibold text-base transition-all cursor-pointer hover:scale-[1.03] active:scale-95 text-white"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: amount === val ? '1.5px solid rgba(255,255,255,0.7)' : '1.5px solid rgba(255,255,255,0.2)',
                  }}
                >
                  R {val}
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleWithdraw}
              className="w-full font-extrabold py-5 rounded-2xl text-lg transition-all hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
              style={{ background: '#ffffff', color: '#1e3a8a' }}
            >
              Confirm withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;